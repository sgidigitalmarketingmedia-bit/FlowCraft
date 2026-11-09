import { Project, Screen, ElementProperties } from '../types/builder';

export interface ComponentJSONSchema {
  $schema: string;
  title: string;
  description: string;
  type: string;
  required: string[];
  properties: Record<string, any>;
  definitions?: Record<string, any>;
}

export function generateComponentSchema(project: Project): ComponentJSONSchema {
  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: `${project.name} - Component Interface Schema`,
    description: 'Formal JSON Schema specification for all UI components and dynamic prop contracts in the design system.',
    type: 'object',
    required: ['screens', 'designTokens', 'flowGraph'],
    properties: {
      screens: {
        type: 'array',
        description: 'Ordered list of mobile screen layouts and component hierarchies',
        items: {
          type: 'object',
          required: ['id', 'title', 'route', 'elements'],
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            route: { type: 'string', pattern: '^\\/[a-z0-9\\-_\\/]*$' },
            backgroundColor: { type: 'string', pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$' },
            isEntry: { type: 'boolean' },
            elements: {
              type: 'array',
              items: { $ref: '#/definitions/UIElement' },
            },
            annotations: {
              type: 'array',
              description: 'Contextual developer sticky notes and architectural pins placed directly on this screen',
              items: { $ref: '#/definitions/ScreenAnnotation' },
            },
          },
        },
      },
      annotationsSummary: {
        type: 'object',
        description: 'Global breakdown of sticky notes and developer context annotations across all screens',
        properties: {
          totalCount: { type: 'number' },
          byCategory: {
            type: 'object',
            properties: {
              api_spec: { type: 'number' },
              dev_note: { type: 'number' },
              interaction: { type: 'number' },
              business_logic: { type: 'number' },
              todo: { type: 'number' },
            },
          },
        },
      },
      designTokens: {
        type: 'object',
        properties: {
          colors: {
            type: 'object',
            properties: {
              primary: { type: 'string', default: '#3B82F6' },
              background: { type: 'string', default: '#0F172A' },
              surface: { type: 'string', default: '#1E293B' },
              text: { type: 'string', default: '#F8FAFC' },
              accent: { type: 'string', default: '#10B981' },
            },
          },
          radii: {
            type: 'object',
            properties: {
              none: { type: 'string', default: '0px' },
              sm: { type: 'string', default: '4px' },
              md: { type: 'string', default: '8px' },
              lg: { type: 'string', default: '12px' },
              xl: { type: 'string', default: '16px' },
              full: { type: 'string', default: '9999px' },
            },
          },
          typography: {
            type: 'object',
            properties: {
              fontFamily: { type: 'string', default: 'Plus Jakarta Sans, sans-serif' },
              monoFamily: { type: 'string', default: 'JetBrains Mono, monospace' },
            },
          },
        },
      },
      flowGraph: {
        type: 'object',
        description: 'State machine transition graph defining user interactions',
        required: ['initialState', 'transitions'],
        properties: {
          initialState: { type: 'string' },
          transitions: {
            type: 'array',
            items: {
              type: 'object',
              required: ['sourceScreen', 'triggerElement', 'triggerEvent', 'action', 'targetScreen'],
              properties: {
                sourceScreen: { type: 'string' },
                triggerElement: { type: 'string' },
                triggerEvent: { type: 'string', enum: ['onClick', 'onSubmit', 'onChange'] },
                action: { type: 'string', enum: ['navigate', 'back', 'bottomSheet', 'toast'] },
                targetScreen: { type: 'string' },
                transitionAnimation: { type: 'string', enum: ['slide-left', 'slide-right', 'slide-up', 'fade', 'pop'] },
              },
            },
          },
        },
      },
    },
    definitions: {
      ScreenAnnotation: {
        type: 'object',
        required: ['id', 'type', 'content', 'category'],
        properties: {
          id: { type: 'string', description: 'Unique annotation identifier' },
          type: { type: 'string', enum: ['sticky_note', 'pin'], description: 'Annotation style: sticky note card or interactive coordinate pin' },
          number: { type: 'number', description: 'Sequence number for annotation pins' },
          title: { type: 'string', description: 'Short summary or title of the note' },
          content: { type: 'string', description: 'Developer implementation instructions, business logic, or API contract details' },
          category: { type: 'string', enum: ['dev_note', 'api_spec', 'interaction', 'business_logic', 'todo'], description: 'Semantic category of context' },
          color: { type: 'string', enum: ['yellow', 'violet', 'emerald', 'amber', 'rose', 'blue', 'slate'] },
          author: { type: 'string', description: 'Author or designer who placed the note' },
          pinnedElementId: { type: 'string', description: 'ID of the UI component this note annotates (optional)' },
          position: {
            type: 'object',
            properties: {
              x: { type: 'number', description: 'X offset coordinate in px from screen top-left' },
              y: { type: 'number', description: 'Y offset coordinate in px from screen top-left' },
            },
          },
          isCollapsed: { type: 'boolean' },
          createdAt: { type: 'string' },
          updatedAt: { type: 'string' },
        },
      },
      UIElement: {
        type: 'object',
        required: ['id', 'type', 'name', 'label'],
        properties: {
          id: { type: 'string', description: 'Unique element identifier' },
          type: {
            type: 'string',
            enum: ['button', 'input', 'card', 'header', 'tabbar', 'avatar', 'badge', 'metric', 'toggle', 'list_item', 'image_banner', 'divider'],
          },
          name: { type: 'string', description: 'Semantic developer component name' },
          label: { type: 'string', description: 'Primary text label or header' },
          placeholder: { type: 'string' },
          value: { type: 'string' },
          variant: { type: 'string', enum: ['primary', 'secondary', 'outline', 'ghost', 'danger', 'success'] },
          size: { type: 'string', enum: ['sm', 'md', 'lg'] },
          icon: { type: 'string' },
          borderRadius: { type: 'string', enum: ['none', 'sm', 'md', 'lg', 'xl', 'full'] },
          fullWidth: { type: 'boolean' },
          disabled: { type: 'boolean' },
          inputType: { type: 'string', enum: ['text', 'email', 'password', 'number', 'search'] },
          metricValue: { type: 'string' },
          metricChange: { type: 'string' },
          interaction: {
            type: 'object',
            properties: {
              trigger: { type: 'string', enum: ['onClick', 'onSubmit', 'onChange'] },
              actionType: { type: 'string', enum: ['navigate', 'back', 'bottomSheet', 'toast'] },
              targetScreenId: { type: 'string' },
              transition: { type: 'string', enum: ['slide-left', 'slide-right', 'slide-up', 'fade', 'pop'] },
            },
          },
        },
      },
    },
  };
}

export function generateHandoffDataPayload(project: Project) {
  const initialScreen = project.screens.find(s => s.isEntry) || project.screens[0];
  
  const allAnnotations = project.screens.flatMap(s =>
    (s.annotations || []).map(a => ({
      ...a,
      screenId: s.id,
      screenTitle: s.title,
      screenRoute: s.route,
      pinnedElementName: s.elements.find(e => e.id === a.pinnedElementId)?.name || null,
    }))
  );

  return {
    meta: {
      projectId: project.id,
      projectName: project.name,
      description: project.description,
      targetDevice: project.devicePreset,
      generatedTimestamp: new Date().toISOString(),
      schemaVersion: '2.5.0',
    },
    annotationsSummary: {
      totalAnnotations: allAnnotations.length,
      byCategory: {
        api_spec: allAnnotations.filter(a => a.category === 'api_spec').length,
        dev_note: allAnnotations.filter(a => a.category === 'dev_note').length,
        interaction: allAnnotations.filter(a => a.category === 'interaction').length,
        business_logic: allAnnotations.filter(a => a.category === 'business_logic').length,
        todo: allAnnotations.filter(a => a.category === 'todo').length,
      },
    },
    screenManifest: project.screens.map(s => ({
      id: s.id,
      title: s.title,
      route: s.route,
      backgroundColor: s.backgroundColor,
      statusBarColor: s.statusBarColor,
      isInitialEntry: s.isEntry,
      componentCount: s.elements.length,
      annotationsCount: (s.annotations || []).length,
      annotations: (s.annotations || []).map(a => ({
        id: a.id,
        type: a.type,
        number: a.number,
        title: a.title || (a.type === 'sticky_note' ? 'Sticky Note' : 'Annotation Pin'),
        content: a.content,
        category: a.category,
        color: a.color,
        author: a.author || 'Product Architect',
        pinnedElementId: a.pinnedElementId || null,
        pinnedElementName: s.elements.find(e => e.id === a.pinnedElementId)?.name || null,
        coordinate: { x: Math.round(a.x), y: Math.round(a.y) },
        isCollapsed: a.isCollapsed || false,
        createdAt: a.createdAt,
      })),
      components: s.elements.map(e => {
        const attachedNotes = (s.annotations || []).filter(a => a.pinnedElementId === e.id);
        return {
          id: e.id,
          name: e.name,
          type: e.type,
          label: e.label,
          variant: e.variant || 'default',
          notesCount: attachedNotes.length,
          developerNotes: attachedNotes.map(n => `[${n.category.toUpperCase()}] ${n.content}`),
          interactiveFlow: e.hasAction ? {
            trigger: e.trigger || 'onClick',
            action: e.actionType || 'navigate',
            targetScreen: e.targetScreenId,
            transitionAnimation: e.transition || 'slide-left',
          } : null,
        };
      }),
    })),
    developerAnnotations: allAnnotations,
    journeyFlowStateMachine: {
      id: 'mobile_journey_machine',
      initialState: initialScreen?.id || 'screen_onboarding',
      states: project.screens.reduce((acc, screen) => {
        const outTransitions = screen.elements
          .filter(e => e.hasAction && e.targetScreenId)
          .map(e => ({
            event: `${e.id}.${e.trigger || 'onClick'}`,
            action: e.actionType || 'navigate',
            target: e.targetScreenId,
            animation: e.transition || 'slide-left',
          }));
        
        acc[screen.id] = {
          route: screen.route,
          title: screen.title,
          annotationsCount: (screen.annotations || []).length,
          on: outTransitions,
        };
        return acc;
      }, {} as Record<string, any>),
    },
    developerNotes: [
      ...allAnnotations.slice(0, 5).map(a => `[${a.screenTitle} • ${a.category.toUpperCase()}] ${a.title ? `${a.title}: ` : ''}${a.content}`),
      'All input fields are wired with React state bindings and validation hooks.',
      'Navigation transitions use CSS transform and opacity with zero layout recalculation.',
      'Theme variables follow Tailwind CSS tokens with full Dark Mode support.',
      'Mobile viewport safe areas (Dynamic Island / bottom notch) are handled with env(safe-area-inset-*).',
    ],
  };
}
