import { Project, Screen, ElementProperties, FlowConnection, ScreenAnnotation, CarouselSlideItem, SliderSlideItem } from '../types/builder';

/**
 * Figma REST API Compatible Data Structures
 * Conforms to the official Figma REST API File Format specifications:
 * https://www.figma.com/developers/api#files-endpoint
 */

export interface FigmaColor {
  r: number; // 0 - 1
  g: number; // 0 - 1
  b: number; // 0 - 1
  a: number; // 0 - 1
}

export interface FigmaBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FigmaPaint {
  type: 'SOLID' | 'GRADIENT_LINEAR' | 'IMAGE';
  visible?: boolean;
  opacity?: number;
  blendMode?: string;
  color?: FigmaColor;
  scaleMode?: 'FILL' | 'FIT' | 'CROP' | 'TILE';
  imageRef?: string;
}

export interface FigmaTypeStyle {
  fontFamily: string;
  fontPostScriptName?: string;
  paragraphSpacing?: number;
  paragraphIndent?: number;
  italic?: boolean;
  fontWeight: number;
  fontSize: number;
  textAlignHorizontal: 'LEFT' | 'RIGHT' | 'CENTER' | 'JUSTIFIED';
  textAlignVertical?: 'TOP' | 'CENTER' | 'BOTTOM';
  letterSpacing?: number;
  lineHeightPx?: number;
  lineHeightPercent?: number;
}

export interface FigmaInteraction {
  trigger: {
    type: 'ON_CLICK' | 'ON_HOVER' | 'ON_PRESS' | 'AFTER_TIMEOUT';
    timeout?: number;
  };
  actions: Array<{
    type: 'NODE';
    destinationId?: string;
    navigation: 'NAVIGATE' | 'OVERLAY' | 'SWAP' | 'BACK' | 'URL';
    url?: string;
    transition?: {
      type: 'SMART_ANIMATE' | 'MOVE_IN' | 'SLIDE_IN' | 'DISSOLVE';
      direction?: 'LEFT' | 'RIGHT' | 'TOP' | 'BOTTOM';
      duration?: number;
      easing?: {
        type: 'EASE_IN' | 'EASE_OUT' | 'EASE_IN_AND_OUT' | 'LINEAR';
      };
    };
  }>;
}

export interface FigmaNode {
  id: string;
  name: string;
  type: 'DOCUMENT' | 'CANVAS' | 'FRAME' | 'GROUP' | 'VECTOR' | 'RECTANGLE' | 'TEXT' | 'COMPONENT' | 'INSTANCE';
  visible?: boolean;
  blendMode?: string;
  children?: FigmaNode[];
  absoluteBoundingBox?: FigmaBoundingBox;
  constraints?: {
    horizontal: 'LEFT' | 'RIGHT' | 'CENTER' | 'LEFT_RIGHT' | 'SCALE';
    vertical: 'TOP' | 'BOTTOM' | 'CENTER' | 'TOP_BOTTOM' | 'SCALE';
  };
  fills?: FigmaPaint[];
  strokes?: FigmaPaint[];
  strokeWeight?: number;
  strokeAlign?: 'INSIDE' | 'OUTSIDE' | 'CENTER';
  cornerRadius?: number;
  clipsContent?: boolean;
  background?: FigmaPaint[];
  backgroundColor?: FigmaColor;
  layoutMode?: 'NONE' | 'HORIZONTAL' | 'VERTICAL';
  primaryAxisSizingMode?: 'FIXED' | 'AUTO';
  counterAxisSizingMode?: 'FIXED' | 'AUTO';
  primaryAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN';
  counterAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX';
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  itemSpacing?: number;
  characters?: string;
  style?: FigmaTypeStyle;
  transitionNodeID?: string;
  transitionDuration?: number;
  transitionEasing?: string;
  interactions?: FigmaInteraction[];
  pluginData?: Record<string, string>;
}

export interface FigmaRestDocument {
  name: string;
  role: string;
  lastModified: string;
  editorType: 'figma' | 'figjam';
  thumbnailUrl: string;
  version: string;
  document: FigmaNode;
  components: Record<string, { key: string; name: string; description: string }>;
  componentSets: Record<string, unknown>;
  schemaVersion: number;
  styles: Record<string, { key: string; name: string; styleType: string; description?: string }>;
}

/**
 * Utility: Convert Hex Color (#RRGGBB or #RRGGBBAA) to Figma RGBA (0-1 float)
 */
export function hexToFigmaColor(hex: string, alpha = 1): FigmaColor {
  if (!hex || typeof hex !== 'string') {
    return { r: 0.1, g: 0.1, b: 0.15, a: 1 };
  }
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  if (clean.length === 6) {
    const num = parseInt(clean, 16);
    return {
      r: Number((((num >> 16) & 255) / 255).toFixed(3)),
      g: Number((((num >> 8) & 255) / 255).toFixed(3)),
      b: Number(((num & 255) / 255).toFixed(3)),
      a: alpha,
    };
  }
  if (clean.length === 8) {
    const num = parseInt(clean, 16);
    return {
      r: Number((((num >> 24) & 255) / 255).toFixed(3)),
      g: Number((((num >> 16) & 255) / 255).toFixed(3)),
      b: Number((((num >> 8) & 255) / 255).toFixed(3)),
      a: Number(((num & 255) / 255).toFixed(3)),
    };
  }
  return { r: 0.1, g: 0.1, b: 0.15, a: 1 };
}

/**
 * Solid Paint generator
 */
export function solidPaint(color: FigmaColor, opacity = 1): FigmaPaint {
  return {
    type: 'SOLID',
    visible: true,
    opacity,
    blendMode: 'NORMAL',
    color,
  };
}

/**
 * Convert builder transition to Figma interaction transition
 */
function getFigmaTransition(transition?: string) {
  switch (transition) {
    case 'slide-left':
      return { type: 'MOVE_IN' as const, direction: 'LEFT' as const, duration: 0.35, easing: { type: 'EASE_OUT' as const } };
    case 'slide-right':
      return { type: 'MOVE_IN' as const, direction: 'RIGHT' as const, duration: 0.35, easing: { type: 'EASE_OUT' as const } };
    case 'slide-up':
      return { type: 'MOVE_IN' as const, direction: 'TOP' as const, duration: 0.35, easing: { type: 'EASE_OUT' as const } };
    case 'slide-down':
      return { type: 'MOVE_IN' as const, direction: 'BOTTOM' as const, duration: 0.35, easing: { type: 'EASE_OUT' as const } };
    case 'scale':
      return { type: 'SMART_ANIMATE' as const, duration: 0.3, easing: { type: 'EASE_OUT' as const } };
    case 'fade':
    default:
      return { type: 'DISSOLVE' as const, duration: 0.3, easing: { type: 'EASE_OUT' as const } };
  }
}

/**
 * Convert FlowCraft Element into Figma Node
 */
export function convertElementToFigmaNode(
  el: ElementProperties,
  screen: Screen,
  index: number,
  screenIdToFigmaIdMap: Record<string, string>
): FigmaNode {
  const elementId = `node_${screen.id}_${el.id || index}`;
  const width = screen.width - 32; // padded width inside screen artboard

  // Prototyping interaction setup if the element has navigation action
  let interactions: FigmaInteraction[] | undefined = undefined;
  let transitionNodeID: string | undefined = undefined;

  if (el.hasAction && el.targetScreenId && screenIdToFigmaIdMap[el.targetScreenId]) {
    const destId = screenIdToFigmaIdMap[el.targetScreenId];
    transitionNodeID = destId;
    interactions = [
      {
        trigger: { type: 'ON_CLICK' },
        actions: [
          {
            type: 'NODE',
            destinationId: destId,
            navigation: 'NAVIGATE',
            transition: getFigmaTransition(el.transition),
          },
        ],
      },
    ];
  }

  switch (el.type) {
    // -------------------------------------------------------------------------
    // 1. BUTTON COMPONENT
    // -------------------------------------------------------------------------
    case 'button': {
      const isPrimary = el.variant === 'primary' || !el.variant;
      const isOutline = el.variant === 'outline';
      const bgColor = isPrimary 
        ? hexToFigmaColor(el.bg || '#2563EB')
        : isOutline
        ? hexToFigmaColor('#000000', 0)
        : hexToFigmaColor('#1E293B');

      const textColor = isPrimary 
        ? hexToFigmaColor(el.color || '#FFFFFF') 
        : isOutline 
        ? hexToFigmaColor('#60A5FA')
        : hexToFigmaColor('#CBD5E1');

      return {
        id: elementId,
        name: `Button / ${el.label || el.name}`,
        type: 'FRAME',
        clipsContent: true,
        cornerRadius: el.borderRadius === 'full' ? 999 : el.borderRadius === 'xl' ? 14 : 10,
        layoutMode: 'HORIZONTAL',
        primaryAxisAlignItems: 'CENTER',
        counterAxisAlignItems: 'CENTER',
        primaryAxisSizingMode: 'FIXED',
        counterAxisSizingMode: 'AUTO',
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 12,
        paddingBottom: 12,
        fills: isOutline ? [] : [solidPaint(bgColor)],
        strokes: isOutline ? [solidPaint(hexToFigmaColor('#3B82F6'), 0.8)] : [],
        strokeWeight: isOutline ? 1.5 : 0,
        transitionNodeID,
        interactions,
        children: [
          {
            id: `${elementId}_label`,
            name: el.label || 'Action Button',
            type: 'TEXT',
            characters: el.label || 'Action Button',
            style: {
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 14,
              textAlignHorizontal: 'CENTER',
              lineHeightPx: 20,
            },
            fills: [solidPaint(textColor)],
          },
        ],
        pluginData: {
          flowcraftType: 'button',
          actionType: el.actionType || 'none',
          targetScreenId: el.targetScreenId || '',
        },
      };
    }

    // -------------------------------------------------------------------------
    // 2. BANNER IMAGE CAROUSEL CONTAINER (Multi-Banner with timing & hyperlinks)
    // -------------------------------------------------------------------------
    case 'carousel':
    case 'asset_slider': {
      const slides = el.carouselSlides || el.sliderSlides || [];
      const height = el.carouselHeight || el.sliderHeight || 190;
      const dwellMs = el.carouselInterval || el.sliderInterval || 3000;
      const speedMs = el.carouselAnimationSpeed || 500;

      const slideNodes: FigmaNode[] = slides.map((slide, sIdx) => {
        const slideId = `${elementId}_slide_${slide.id || sIdx}`;
        let slideInteractions: FigmaInteraction[] | undefined = undefined;
        let slideTransitionId: string | undefined = undefined;

        if (slide.targetScreenId && screenIdToFigmaIdMap[slide.targetScreenId]) {
          slideTransitionId = screenIdToFigmaIdMap[slide.targetScreenId];
          slideInteractions = [
            {
              trigger: { type: 'ON_CLICK' },
              actions: [
                {
                  type: 'NODE',
                  destinationId: slideTransitionId,
                  navigation: 'NAVIGATE',
                  transition: getFigmaTransition(slide.transition),
                },
              ],
            },
          ];
        }

        const childOverlayNodes: FigmaNode[] = [];

        // Slide title text
        if (slide.title) {
          childOverlayNodes.push({
            id: `${slideId}_title`,
            name: 'Slide Title',
            type: 'TEXT',
            characters: slide.title,
            style: {
              fontFamily: 'Inter',
              fontWeight: 700,
              fontSize: 13,
              textAlignHorizontal: 'LEFT',
              lineHeightPx: 18,
            },
            fills: [solidPaint(hexToFigmaColor('#FFFFFF'))],
          });
        }

        // Slide subtitle text
        const subtitleText = (slide as any).subtitle || (slide as any).caption;
        if (subtitleText) {
          childOverlayNodes.push({
            id: `${slideId}_subtitle`,
            name: 'Slide Subtitle',
            type: 'TEXT',
            characters: subtitleText,
            style: {
              fontFamily: 'Inter',
              fontWeight: 400,
              fontSize: 10,
              textAlignHorizontal: 'LEFT',
              lineHeightPx: 14,
            },
            fills: [solidPaint(hexToFigmaColor('#CBD5E1'))],
          });
        }

        return {
          id: slideId,
          name: `Slide ${sIdx + 1}: ${slide.title || 'Banner'}`,
          type: 'FRAME',
          clipsContent: true,
          cornerRadius: el.carouselBorderRadius || 16,
          layoutMode: 'VERTICAL',
          primaryAxisAlignItems: 'MAX', // bottom aligned content
          counterAxisAlignItems: 'MIN',
          paddingLeft: 12,
          paddingRight: 12,
          paddingTop: 12,
          paddingBottom: 12,
          itemSpacing: 4,
          fills: [
            {
              type: 'IMAGE',
              scaleMode: 'FILL',
              imageRef: slide.imageUrl || '',
            },
            solidPaint(hexToFigmaColor('#05070D'), 0.4),
          ],
          transitionNodeID: slideTransitionId,
          interactions: slideInteractions,
          children: childOverlayNodes,
          pluginData: {
            slideImageUrl: slide.imageUrl || '',
            slideTargetScreenId: slide.targetScreenId || '',
          },
        };
      });

      return {
        id: elementId,
        name: `Carousel / ${el.label || el.name || 'Banner Carousel'}`,
        type: 'FRAME',
        clipsContent: true,
        cornerRadius: el.carouselBorderRadius || 16,
        layoutMode: 'HORIZONTAL',
        itemSpacing: 10,
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 4,
        paddingBottom: 4,
        fills: [solidPaint(hexToFigmaColor('#090D16'), 0.8)],
        strokes: [solidPaint(hexToFigmaColor('#1E293B'), 0.6)],
        strokeWeight: 1,
        children: slideNodes,
        pluginData: {
          flowcraftType: 'carousel',
          dwellIntervalMs: String(dwellMs),
          animationSpeedMs: String(speedMs),
          autoplay: String(el.carouselAutoplay ?? true),
          slidesCount: String(slides.length),
        },
      };
    }

    // -------------------------------------------------------------------------
    // 3. 16:9 STREAMING VIDEO PLAYER & MEDIA FRAME
    // -------------------------------------------------------------------------
    case 'video_player':
    case 'media_placeholder': {
      const isVideo = el.type === 'video_player' || el.mediaType === 'video';
      const videoSrc = el.videoUrl || el.imageUrl || '';
      const posterUrl = el.videoPoster || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800';

      return {
        id: elementId,
        name: `Media / ${isVideo ? 'Video Player' : 'Media Frame'} - ${el.label || el.name}`,
        type: 'FRAME',
        clipsContent: true,
        cornerRadius: 16,
        layoutMode: 'VERTICAL',
        primaryAxisAlignItems: 'CENTER',
        counterAxisAlignItems: 'CENTER',
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 12,
        paddingBottom: 12,
        itemSpacing: 8,
        fills: [
          {
            type: 'IMAGE',
            scaleMode: 'FILL',
            imageRef: posterUrl,
          },
          solidPaint(hexToFigmaColor('#020408'), 0.55),
        ],
        strokes: [solidPaint(hexToFigmaColor('#3B82F6'), 0.4)],
        strokeWeight: 1,
        transitionNodeID,
        interactions,
        children: [
          // Play button circle
          {
            id: `${elementId}_play_icon`,
            name: 'Play Badge Circle',
            type: 'FRAME',
            cornerRadius: 999,
            layoutMode: 'HORIZONTAL',
            primaryAxisAlignItems: 'CENTER',
            counterAxisAlignItems: 'CENTER',
            paddingLeft: 14,
            paddingRight: 14,
            paddingTop: 14,
            paddingBottom: 14,
            fills: [solidPaint(hexToFigmaColor('#2563EB'), 0.9)],
            children: [
              {
                id: `${elementId}_play_text`,
                name: 'Play Icon',
                type: 'TEXT',
                characters: '▶',
                style: {
                  fontFamily: 'Inter',
                  fontWeight: 700,
                  fontSize: 16,
                  textAlignHorizontal: 'CENTER',
                },
                fills: [solidPaint(hexToFigmaColor('#FFFFFF'))],
              },
            ],
          },
          // Video caption and duration
          {
            id: `${elementId}_caption`,
            name: 'Caption',
            type: 'TEXT',
            characters: el.mediaCaption || el.label || 'Watch Video Stream',
            style: {
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 11,
              textAlignHorizontal: 'CENTER',
            },
            fills: [solidPaint(hexToFigmaColor('#F1F5F9'))],
          },
          {
            id: `${elementId}_duration`,
            name: 'Duration Tag',
            type: 'TEXT',
            characters: el.mediaDuration || '02:45',
            style: {
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: 9,
              textAlignHorizontal: 'CENTER',
            },
            fills: [solidPaint(hexToFigmaColor('#93C5FD'))],
          },
        ],
        pluginData: {
          flowcraftType: 'video_player',
          videoUrl: videoSrc,
          duration: el.mediaDuration || '',
          loop: String(el.videoLoop ?? true),
          autoplay: String(el.videoAutoplay ?? false),
        },
      };
    }

    // -------------------------------------------------------------------------
    // 4. TEXT INPUT COMPONENT
    // -------------------------------------------------------------------------
    case 'input': {
      return {
        id: elementId,
        name: `Input / ${el.label || el.name}`,
        type: 'FRAME',
        layoutMode: 'VERTICAL',
        itemSpacing: 6,
        fills: [],
        children: [
          {
            id: `${elementId}_label`,
            name: 'Field Label',
            type: 'TEXT',
            characters: el.label || 'Input Field',
            style: {
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: 11,
              textAlignHorizontal: 'LEFT',
              lineHeightPx: 16,
            },
            fills: [solidPaint(hexToFigmaColor('#94A3B8'))],
          },
          {
            id: `${elementId}_field`,
            name: 'Input Box',
            type: 'FRAME',
            cornerRadius: 10,
            layoutMode: 'HORIZONTAL',
            counterAxisAlignItems: 'CENTER',
            paddingLeft: 12,
            paddingRight: 12,
            paddingTop: 10,
            paddingBottom: 10,
            fills: [solidPaint(hexToFigmaColor('#0B0F19'))],
            strokes: [solidPaint(hexToFigmaColor('#334155'))],
            strokeWeight: 1,
            children: [
              {
                id: `${elementId}_placeholder`,
                name: 'Placeholder Text',
                type: 'TEXT',
                characters: el.value || el.placeholder || 'Enter value...',
                style: {
                  fontFamily: 'Inter',
                  fontWeight: 400,
                  fontSize: 13,
                  textAlignHorizontal: 'LEFT',
                  lineHeightPx: 18,
                },
                fills: [solidPaint(el.value ? hexToFigmaColor('#F8FAFC') : hexToFigmaColor('#64748B'))],
              },
            ],
          },
        ],
        pluginData: {
          flowcraftType: 'input',
          inputType: el.inputType || 'text',
          placeholder: el.placeholder || '',
        },
      };
    }

    // -------------------------------------------------------------------------
    // 5. VALUE PROPOSITION / FEATURE CARD
    // -------------------------------------------------------------------------
    case 'card': {
      const cardChildren: FigmaNode[] = [
        {
          id: `${elementId}_title`,
          name: 'Card Title',
          type: 'TEXT',
          characters: el.label || 'Card Headline',
          style: {
            fontFamily: 'Inter',
            fontWeight: 700,
            fontSize: 14,
            textAlignHorizontal: 'LEFT',
            lineHeightPx: 20,
          },
          fills: [solidPaint(hexToFigmaColor('#F8FAFC'))],
        },
      ];

      if (el.helperText) {
        cardChildren.push({
          id: `${elementId}_desc`,
          name: 'Card Description',
          type: 'TEXT',
          characters: el.helperText,
          style: {
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: 11,
            textAlignHorizontal: 'LEFT',
            lineHeightPx: 16,
          },
          fills: [solidPaint(hexToFigmaColor('#94A3B8'))],
        });
      }

      return {
        id: elementId,
        name: `Card / ${el.label || el.name}`,
        type: 'FRAME',
        cornerRadius: 16,
        layoutMode: 'VERTICAL',
        itemSpacing: 6,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 14,
        paddingBottom: 14,
        fills: [solidPaint(hexToFigmaColor(el.bg || '#1E293B'))],
        strokes: [solidPaint(hexToFigmaColor('#334155'), 0.8)],
        strokeWeight: 1,
        transitionNodeID,
        interactions,
        children: cardChildren,
        pluginData: {
          flowcraftType: 'card',
        },
      };
    }

    // -------------------------------------------------------------------------
    // 6. METRIC DISPLAY (e.g. Portfolio Balance)
    // -------------------------------------------------------------------------
    case 'metric': {
      return {
        id: elementId,
        name: `Metric / ${el.label || el.name}`,
        type: 'FRAME',
        cornerRadius: 16,
        layoutMode: 'VERTICAL',
        itemSpacing: 4,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 14,
        paddingBottom: 14,
        fills: [solidPaint(hexToFigmaColor('#111827'))],
        strokes: [solidPaint(hexToFigmaColor('#1F2937'))],
        strokeWeight: 1,
        children: [
          {
            id: `${elementId}_label`,
            name: 'Metric Label',
            type: 'TEXT',
            characters: (el.label || 'Metric').toUpperCase(),
            style: {
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 10,
              textAlignHorizontal: 'LEFT',
              letterSpacing: 0.8,
            },
            fills: [solidPaint(hexToFigmaColor('#9CA3AF'))],
          },
          {
            id: `${elementId}_val`,
            name: 'Metric Value',
            type: 'TEXT',
            characters: el.metricValue || '$0.00',
            style: {
              fontFamily: 'JetBrains Mono',
              fontWeight: 800,
              fontSize: 24,
              textAlignHorizontal: 'LEFT',
              lineHeightPx: 30,
            },
            fills: [solidPaint(hexToFigmaColor('#FFFFFF'))],
          },
          ...(el.metricChange ? [
            {
              id: `${elementId}_change`,
              name: 'Metric Delta',
              type: 'TEXT',
              characters: el.metricChange,
              style: {
                fontFamily: 'Inter',
                fontWeight: 600,
                fontSize: 11,
                textAlignHorizontal: 'LEFT',
              },
              fills: [solidPaint(hexToFigmaColor('#10B981'))],
            } as FigmaNode
          ] : []),
        ],
        pluginData: {
          flowcraftType: 'metric',
          metricValue: el.metricValue || '',
        },
      };
    }

    // -------------------------------------------------------------------------
    // 7. RESPONSIVE HERO IMAGE BANNER
    // -------------------------------------------------------------------------
    case 'image_banner': {
      return {
        id: elementId,
        name: `Hero Image / ${el.label || el.name}`,
        type: 'FRAME',
        clipsContent: true,
        cornerRadius: 16,
        layoutMode: 'VERTICAL',
        primaryAxisAlignItems: 'MAX',
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 16,
        paddingBottom: 16,
        fills: [
          {
            type: 'IMAGE',
            scaleMode: 'FILL',
            imageRef: el.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
          },
          solidPaint(hexToFigmaColor('#000000'), 0.35),
        ],
        children: [
          {
            id: `${elementId}_banner_label`,
            name: 'Banner Label',
            type: 'TEXT',
            characters: el.label || 'Hero Banner',
            style: {
              fontFamily: 'Inter',
              fontWeight: 700,
              fontSize: 15,
              textAlignHorizontal: 'LEFT',
            },
            fills: [solidPaint(hexToFigmaColor('#FFFFFF'))],
          },
        ],
        pluginData: {
          flowcraftType: 'image_banner',
          imageUrl: el.imageUrl || '',
        },
      };
    }

    // -------------------------------------------------------------------------
    // 8. LIST ITEM / TRANSACTION ROW
    // -------------------------------------------------------------------------
    case 'list_item': {
      return {
        id: elementId,
        name: `ListItem / ${el.label || el.name}`,
        type: 'FRAME',
        cornerRadius: 12,
        layoutMode: 'HORIZONTAL',
        counterAxisAlignItems: 'CENTER',
        primaryAxisAlignItems: 'SPACE_BETWEEN',
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 10,
        paddingBottom: 10,
        fills: [solidPaint(hexToFigmaColor('#1E293B'), 0.4)],
        strokes: [solidPaint(hexToFigmaColor('#334155'), 0.5)],
        strokeWeight: 1,
        transitionNodeID,
        interactions,
        children: [
          {
            id: `${elementId}_left_stack`,
            name: 'Text Group',
            type: 'FRAME',
            layoutMode: 'VERTICAL',
            itemSpacing: 2,
            fills: [],
            children: [
              {
                id: `${elementId}_title`,
                name: 'Item Title',
                type: 'TEXT',
                characters: el.label || 'List Item',
                style: {
                  fontFamily: 'Inter',
                  fontWeight: 600,
                  fontSize: 12,
                  textAlignHorizontal: 'LEFT',
                },
                fills: [solidPaint(hexToFigmaColor('#F1F5F9'))],
              },
              ...(el.helperText ? [
                {
                  id: `${elementId}_subtitle`,
                  name: 'Subtitle',
                  type: 'TEXT',
                  characters: el.helperText,
                  style: {
                    fontFamily: 'Inter',
                    fontWeight: 400,
                    fontSize: 10,
                    textAlignHorizontal: 'LEFT',
                  },
                  fills: [solidPaint(hexToFigmaColor('#94A3B8'))],
                } as FigmaNode
              ] : []),
            ],
          },
          ...(el.metricValue ? [
            {
              id: `${elementId}_amt`,
              name: 'Amount Value',
              type: 'TEXT',
              characters: el.metricValue,
              style: {
                fontFamily: 'JetBrains Mono',
                fontWeight: 700,
                fontSize: 12,
                textAlignHorizontal: 'RIGHT',
              },
              fills: [solidPaint(hexToFigmaColor('#FFFFFF'))],
            } as FigmaNode
          ] : []),
        ],
        pluginData: {
          flowcraftType: 'list_item',
        },
      };
    }

    // -------------------------------------------------------------------------
    // 9. APP HEADER / TOP APP BAR
    // -------------------------------------------------------------------------
    case 'header': {
      return {
        id: elementId,
        name: `Header / ${el.label || el.name}`,
        type: 'FRAME',
        layoutMode: 'HORIZONTAL',
        counterAxisAlignItems: 'CENTER',
        primaryAxisAlignItems: 'SPACE_BETWEEN',
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 8,
        paddingBottom: 8,
        fills: [],
        children: [
          {
            id: `${elementId}_title`,
            name: 'Screen Header Title',
            type: 'TEXT',
            characters: el.label || screen.title,
            style: {
              fontFamily: 'Inter',
              fontWeight: 800,
              fontSize: 18,
              textAlignHorizontal: 'LEFT',
              lineHeightPx: 24,
            },
            fills: [solidPaint(hexToFigmaColor('#FFFFFF'))],
          },
        ],
        pluginData: {
          flowcraftType: 'header',
        },
      };
    }

    // -------------------------------------------------------------------------
    // 10. TAB BAR / BOTTOM DOCK
    // -------------------------------------------------------------------------
    case 'tabbar': {
      const tabs = el.tabItems || [
        { id: 'tab1', label: 'Home' },
        { id: 'tab2', label: 'Transfers' },
        { id: 'tab3', label: 'Vault' },
      ];

      return {
        id: elementId,
        name: `TabBar / Bottom Navigation`,
        type: 'FRAME',
        cornerRadius: 16,
        layoutMode: 'HORIZONTAL',
        primaryAxisAlignItems: 'SPACE_BETWEEN',
        counterAxisAlignItems: 'CENTER',
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 10,
        paddingBottom: 10,
        fills: [solidPaint(hexToFigmaColor('#0B0F19'), 0.95)],
        strokes: [solidPaint(hexToFigmaColor('#1E293B'))],
        strokeWeight: 1,
        children: tabs.map((tab, tIdx) => ({
          id: `${elementId}_tab_${tab.id || tIdx}`,
          name: `Tab: ${tab.label}`,
          type: 'FRAME',
          layoutMode: 'VERTICAL',
          counterAxisAlignItems: 'CENTER',
          itemSpacing: 2,
          fills: [],
          children: [
            {
              id: `${elementId}_tab_${tIdx}_text`,
              name: tab.label,
              type: 'TEXT',
              characters: tab.label,
              style: {
                fontFamily: 'Inter',
                fontWeight: tIdx === 0 ? 700 : 500,
                fontSize: 10,
                textAlignHorizontal: 'CENTER',
              },
              fills: [solidPaint(tIdx === 0 ? hexToFigmaColor('#3B82F6') : hexToFigmaColor('#64748B'))],
            },
          ],
        })),
        pluginData: {
          flowcraftType: 'tabbar',
        },
      };
    }

    // -------------------------------------------------------------------------
    // 11. BADGE & CHIP
    // -------------------------------------------------------------------------
    case 'badge': {
      return {
        id: elementId,
        name: `Badge / ${el.label || el.name}`,
        type: 'FRAME',
        cornerRadius: 6,
        layoutMode: 'HORIZONTAL',
        counterAxisAlignItems: 'CENTER',
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 4,
        paddingBottom: 4,
        fills: [solidPaint(hexToFigmaColor('#065F46'), 0.3)],
        strokes: [solidPaint(hexToFigmaColor('#10B981'), 0.4)],
        strokeWeight: 1,
        children: [
          {
            id: `${elementId}_label`,
            name: 'Badge Text',
            type: 'TEXT',
            characters: el.label || 'Verified',
            style: {
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 10,
              textAlignHorizontal: 'CENTER',
            },
            fills: [solidPaint(hexToFigmaColor('#34D399'))],
          },
        ],
        pluginData: {
          flowcraftType: 'badge',
        },
      };
    }

    // -------------------------------------------------------------------------
    // 12. DEFAULT FALLBACK FRAME FOR ANY OTHER CONTROL
    // -------------------------------------------------------------------------
    default: {
      return {
        id: elementId,
        name: `${el.type.toUpperCase()} / ${el.label || el.name}`,
        type: 'FRAME',
        cornerRadius: 10,
        layoutMode: 'HORIZONTAL',
        counterAxisAlignItems: 'CENTER',
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 8,
        paddingBottom: 8,
        fills: [solidPaint(hexToFigmaColor('#1E293B'), 0.5)],
        strokes: [solidPaint(hexToFigmaColor('#334155'), 0.5)],
        strokeWeight: 1,
        transitionNodeID,
        interactions,
        children: [
          {
            id: `${elementId}_label`,
            name: 'Control Label',
            type: 'TEXT',
            characters: el.label || el.name,
            style: {
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: 12,
              textAlignHorizontal: 'LEFT',
            },
            fills: [solidPaint(hexToFigmaColor('#E2E8F0'))],
          },
        ],
        pluginData: {
          flowcraftType: el.type,
        },
      };
    }
  }
}

/**
 * Convert FlowCraft Screen Artboard to Figma FRAME node
 */
export function convertScreenToFigmaFrame(
  screen: Screen,
  screenIndex: number,
  screenIdToFigmaIdMap: Record<string, string>
): FigmaNode {
  const figmaId = screenIdToFigmaIdMap[screen.id] || `1:${screenIndex + 1}`;
  const bgColor = hexToFigmaColor(screen.backgroundColor || '#0F172A');

  const elementNodes = screen.elements.map((el, idx) =>
    convertElementToFigmaNode(el, screen, idx, screenIdToFigmaIdMap)
  );

  return {
    id: figmaId,
    name: screen.title,
    type: 'FRAME',
    blendMode: 'PASS_THROUGH',
    clipsContent: true,
    cornerRadius: 32,
    absoluteBoundingBox: {
      x: screen.x || screenIndex * 420,
      y: screen.y || 80,
      width: screen.width || 360,
      height: screen.height || 720,
    },
    constraints: {
      horizontal: 'LEFT',
      vertical: 'TOP',
    },
    background: [solidPaint(bgColor)],
    backgroundColor: bgColor,
    layoutMode: 'VERTICAL',
    primaryAxisSizingMode: 'AUTO',
    counterAxisSizingMode: 'FIXED',
    primaryAxisAlignItems: 'MIN',
    counterAxisAlignItems: 'MIN',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 44,
    paddingBottom: 24,
    itemSpacing: 12,
    children: elementNodes,
    pluginData: {
      screenId: screen.id,
      route: screen.route || '',
      isEntry: String(screen.isEntry || false),
      statusBarColor: screen.statusBarColor || 'light',
    },
  };
}

/**
 * Convert Sticky Notes and Screen Annotations into FigJam / Figma sticky notes
 */
export function convertAnnotationsToFigmaNodes(
  screens: Screen[]
): FigmaNode[] {
  const annotationNodes: FigmaNode[] = [];

  screens.forEach((screen, sIdx) => {
    (screen.annotations || []).forEach((ann, aIdx) => {
      const annId = `ann_${ann.id || `${sIdx}_${aIdx}`}`;
      const noteColor = ann.color === 'yellow' 
        ? hexToFigmaColor('#FEF08A')
        : ann.color === 'violet'
        ? hexToFigmaColor('#DDD6FE')
        : ann.color === 'emerald'
        ? hexToFigmaColor('#A7F3D0')
        : hexToFigmaColor('#BAE6FD');

      annotationNodes.push({
        id: annId,
        name: `Sticky Note #${ann.number}: ${ann.title}`,
        type: 'FRAME',
        cornerRadius: 8,
        layoutMode: 'VERTICAL',
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 10,
        paddingBottom: 10,
        itemSpacing: 6,
        absoluteBoundingBox: {
          x: (screen.x || sIdx * 420) + (ann.x || 20),
          y: (screen.y || 80) + (ann.y || 100),
          width: ann.width || 220,
          height: 140,
        },
        fills: [solidPaint(noteColor)],
        strokes: [solidPaint(hexToFigmaColor('#000000', 0.15))],
        strokeWeight: 1,
        children: [
          {
            id: `${annId}_header`,
            name: 'Note Header',
            type: 'TEXT',
            characters: `[${ann.category.toUpperCase()}] ${ann.title}`,
            style: {
              fontFamily: 'Inter',
              fontWeight: 700,
              fontSize: 11,
              textAlignHorizontal: 'LEFT',
            },
            fills: [solidPaint(hexToFigmaColor('#1E293B'))],
          },
          {
            id: `${annId}_content`,
            name: 'Note Body',
            type: 'TEXT',
            characters: ann.content,
            style: {
              fontFamily: 'Inter',
              fontWeight: 400,
              fontSize: 10,
              textAlignHorizontal: 'LEFT',
              lineHeightPx: 14,
            },
            fills: [solidPaint(hexToFigmaColor('#334155'))],
          },
          {
            id: `${annId}_author`,
            name: 'Author Tag',
            type: 'TEXT',
            characters: `By: ${ann.author || 'Product Lead'}`,
            style: {
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 9,
              textAlignHorizontal: 'LEFT',
            },
            fills: [solidPaint(hexToFigmaColor('#64748B'))],
          },
        ],
        pluginData: {
          category: ann.category,
          author: ann.author || '',
        },
      });
    });
  });

  return annotationNodes;
}

/**
 * Main Generator: Figma REST API Full Document JSON Payload
 */
export function generateFigmaRestApiPayload(project: Project): FigmaRestDocument {
  // Map internal screen IDs to Figma standard node IDs (e.g. "1:2")
  const screenIdToFigmaIdMap: Record<string, string> = {};
  project.screens.forEach((screen, index) => {
    screenIdToFigmaIdMap[screen.id] = `1:${index + 10}`;
  });

  // Convert screens to Figma Frames
  const screenFrames = project.screens.map((screen, index) =>
    convertScreenToFigmaFrame(screen, index, screenIdToFigmaIdMap)
  );

  // Convert Sticky Notes / Annotations
  const annotationFrames = convertAnnotationsToFigmaNodes(project.screens);

  // Identify entry screen for starting point
  const entryScreen = project.screens.find(s => s.isEntry) || project.screens[0];
  const startingPointId = entryScreen ? screenIdToFigmaIdMap[entryScreen.id] : undefined;

  // Figma Page 1 Canvas
  const page1Canvas: FigmaNode = {
    id: '0:1',
    name: 'Page 1 - Mobile Journey Wireframes & Prototyping',
    type: 'CANVAS',
    backgroundColor: hexToFigmaColor('#0A0814'),
    children: [...screenFrames, ...annotationFrames],
    pluginData: {
      startingNodeId: startingPointId || '',
      totalScreens: String(project.screens.length),
      connectionsCount: String(project.connections.length),
    },
  };

  // Top-level Figma REST Document
  return {
    name: project.name || 'Mobile App Prototype',
    role: 'editor',
    lastModified: project.updatedAt || new Date().toISOString(),
    editorType: 'figma',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
    version: '1.0.0',
    schemaVersion: 0,
    document: {
      id: '0:0',
      name: 'Document',
      type: 'DOCUMENT',
      children: [page1Canvas],
    },
    components: {
      comp_btn_primary: {
        key: 'comp_btn_primary',
        name: 'Buttons / Primary Button',
        description: 'Standard call-to-action button with auto-layout',
      },
      comp_carousel: {
        key: 'comp_carousel',
        name: 'Media / Banner Image Carousel',
        description: 'Auto-scrolling banner image carousel with dwell pause and slide animation speed controls',
      },
      comp_video_player: {
        key: 'comp_video_player',
        name: 'Media / 16:9 Video Streaming Frame',
        description: 'Direct internet MP4 / stream player container with playback indicators',
      },
    },
    componentSets: {},
    styles: {
      style_primary: {
        key: 'style_primary',
        name: 'Brand / Primary Accent',
        styleType: 'FILL',
        description: 'Primary UI interactive brand color',
      },
      style_surface: {
        key: 'style_surface',
        name: 'Surface / Dark Background',
        styleType: 'FILL',
        description: 'Screen artboard dark theme canvas',
      },
      style_heading: {
        key: 'style_heading',
        name: 'Typography / Heading 1',
        styleType: 'TEXT',
        description: 'Plus Jakarta Sans & Inter font scale',
      },
    },
  };
}

/**
 * Generate a standalone copy-pasteable Figma Plugin Script
 * This script runs directly inside Figma's Plugin Console or Scripter plugin
 * to recreate the screens and components on the Figma canvas natively!
 */
export function generateFigmaPluginScript(project: Project): string {
  const jsonPayload = JSON.stringify(generateFigmaRestApiPayload(project));

  return `/**
 * FlowCraft to Figma Direct Canvas Importer Script
 * Run this snippet inside Figma -> Plugins -> Development -> Open Console / Scripter
 * or save as a Figma Plugin code.ts.
 *
 * Generated for: ${project.name}
 * Total Artboards: ${project.screens.length} Screens
 */

async function importFlowCraftToFigma() {
  const data = ${jsonPayload};
  console.log("🚀 Starting import of " + data.name + " into active Figma page...");

  // Load standard fonts used across wireframes
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });
  await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });

  const page = figma.currentPage;
  const createdFrames = new Map();

  const canvasNode = data.document.children[0];
  if (!canvasNode || !canvasNode.children) return;

  for (const screenNode of canvasNode.children) {
    if (screenNode.type !== 'FRAME') continue;

    // 1. Create Screen Frame
    const frame = figma.createFrame();
    frame.name = screenNode.name;
    frame.x = screenNode.absoluteBoundingBox ? screenNode.absoluteBoundingBox.x : 0;
    frame.y = screenNode.absoluteBoundingBox ? screenNode.absoluteBoundingBox.y : 0;
    frame.resize(
      screenNode.absoluteBoundingBox ? screenNode.absoluteBoundingBox.width : 360,
      screenNode.absoluteBoundingBox ? screenNode.absoluteBoundingBox.height : 720
    );
    frame.cornerRadius = screenNode.cornerRadius || 28;
    frame.clipsContent = true;

    // Screen Background Color
    if (screenNode.backgroundColor) {
      frame.fills = [{
        type: 'SOLID',
        color: {
          r: screenNode.backgroundColor.r,
          g: screenNode.backgroundColor.g,
          b: screenNode.backgroundColor.b
        }
      }];
    }

    // Set Auto-Layout for Screen
    frame.layoutMode = 'VERTICAL';
    frame.itemSpacing = screenNode.itemSpacing || 12;
    frame.paddingLeft = screenNode.paddingLeft || 16;
    frame.paddingRight = screenNode.paddingRight || 16;
    frame.paddingTop = screenNode.paddingTop || 44;
    frame.paddingBottom = screenNode.paddingBottom || 24;

    // 2. Create Elements inside Screen
    if (screenNode.children) {
      for (const elNode of screenNode.children) {
        if (elNode.type === 'FRAME') {
          const elFrame = figma.createFrame();
          elFrame.name = elNode.name;
          elFrame.cornerRadius = elNode.cornerRadius || 12;
          elFrame.layoutMode = elNode.layoutMode || 'HORIZONTAL';
          elFrame.itemSpacing = elNode.itemSpacing || 8;
          elFrame.paddingLeft = elNode.paddingLeft || 12;
          elFrame.paddingRight = elNode.paddingRight || 12;
          elFrame.paddingTop = elNode.paddingTop || 10;
          elFrame.paddingBottom = elNode.paddingBottom || 10;

          if (elNode.fills && elNode.fills.length > 0 && elNode.fills[0].color) {
            elFrame.fills = [{
              type: 'SOLID',
              color: elNode.fills[0].color,
              opacity: elNode.fills[0].opacity ?? 1
            }];
          }

          // Nested text label
          if (elNode.children) {
            for (const child of elNode.children) {
              if (child.type === 'TEXT') {
                const text = figma.createText();
                text.characters = child.characters || '';
                text.fontSize = (child.style && child.style.fontSize) || 13;
                if (child.fills && child.fills[0] && child.fills[0].color) {
                  text.fills = [{ type: 'SOLID', color: child.fills[0].color }];
                }
                elFrame.appendChild(text);
              }
            }
          }

          frame.appendChild(elFrame);
          elFrame.layoutAlign = 'STRETCH';
        }
      }
    }

    page.appendChild(frame);
    createdFrames.set(screenNode.id, frame);
  }

  // Focus view on created frames
  figma.viewport.scrollAndZoomIntoView(Array.from(createdFrames.values()));
  figma.notify("✅ Successfully imported " + createdFrames.size + " screen layouts into Figma!");
}

importFlowCraftToFigma();
`;
}
