import {
  defineComponent,
  h,
  Fragment,
  Text,
  type PropType,
  type VNode,
  type VNodeArrayChildren,
} from 'vue';
import { tokenize, type TcyOptions, type TargetPreset } from '@love-rox/tcy-core';

type TransformContext = {
  className: string;
  tag: string;
  options: TcyOptions;
};

function transformString(value: string, ctx: TransformContext): VNodeArrayChildren {
  const segments = tokenize(value, ctx.options);
  return segments.map((seg) =>
    seg.type === 'text'
      ? (seg.value as unknown as VNode)
      : h(ctx.tag, { class: ctx.className }, seg.value),
  );
}

function transformChildren(children: unknown, ctx: TransformContext): VNodeArrayChildren {
  if (children == null || typeof children === 'boolean') return [];
  if (typeof children === 'string' || typeof children === 'number') {
    return transformString(String(children), ctx);
  }
  if (Array.isArray(children)) {
    return children.flatMap((c) => transformChildren(c, ctx));
  }

  const vnode = children as VNode;
  if (vnode && typeof vnode === 'object' && 'type' in vnode) {
    if (vnode.type === Text) {
      return transformString(String(vnode.children ?? ''), ctx);
    }
    if (vnode.type === Fragment) {
      return [h(Fragment, null, transformChildren(vnode.children, ctx))];
    }
    const nested = transformChildren(vnode.children, ctx);
    return [h(vnode.type as string, vnode.props ?? undefined, nested)];
  }

  return [];
}

/**
 * Vue 3 component that automatically wraps tcy-target characters in child text
 * nodes with `<span>` (or a custom tag) for vertical typesetting.
 */
export const Tcy = defineComponent({
  name: 'Tcy',
  props: {
    className: { type: String, default: 'tcy' },
    as: { type: String, default: 'span' },
    target: {
      type: [String, RegExp] as PropType<TargetPreset | RegExp>,
      default: 'alphanumeric',
    },
    combine: { type: Boolean, default: true },
    include: {
      type: [String, Array] as PropType<string | string[]>,
      default: undefined,
    },
    exclude: {
      type: [String, Array] as PropType<string | string[]>,
      default: undefined,
    },
    maxLength: {
      type: Number as PropType<number>,
      default: undefined,
    },
    excludeWords: {
      type: Array as PropType<string[]>,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    return () => {
      const ctx: TransformContext = {
        className: props.className,
        tag: props.as,
        options: {
          target: props.target,
          combine: props.combine,
          include: props.include,
          exclude: props.exclude,
          maxLength: props.maxLength,
          excludeWords: props.excludeWords,
        },
      };
      const children = slots.default?.() ?? [];
      return h(Fragment, null, transformChildren(children, ctx));
    };
  },
});
