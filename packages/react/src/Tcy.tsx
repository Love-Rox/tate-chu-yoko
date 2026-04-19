import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  type JSX,
  type ReactElement,
  type ReactNode,
} from 'react';
import { tokenize, type TcyOptions } from '@love-rox/tcy-core';

export interface TcyProps extends TcyOptions {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

type TransformOptions = {
  className: string;
  tag: keyof JSX.IntrinsicElements;
  tcyOptions: TcyOptions;
};

function transformString(
  value: string,
  keyPrefix: string,
  { className, tag, tcyOptions }: TransformOptions,
): ReactNode {
  const segments = tokenize(value, tcyOptions);
  if (segments.length === 0) return null;

  const Tag = tag;
  return segments.map((seg, i) => {
    const key = `${keyPrefix}:${i}`;
    if (seg.type === 'text') return <Fragment key={key}>{seg.value}</Fragment>;
    return (
      <Tag key={key} className={className}>
        {seg.value}
      </Tag>
    );
  });
}

function transformNode(node: ReactNode, keyPrefix: string, opts: TransformOptions): ReactNode {
  if (node == null || typeof node === 'boolean') return node;
  if (typeof node === 'string') return transformString(node, keyPrefix, opts);
  if (typeof node === 'number') return transformString(String(node), keyPrefix, opts);

  if (Array.isArray(node)) {
    return node.map((child, i) => (
      <Fragment key={`${keyPrefix}.${i}`}>
        {transformNode(child, `${keyPrefix}.${i}`, opts)}
      </Fragment>
    ));
  }

  if (isValidElement(node)) {
    const element = node as ReactElement<{ children?: ReactNode }>;
    const children = element.props.children;
    if (children === undefined) return element;
    const transformed = Children.map(children, (child, i) =>
      transformNode(child, `${keyPrefix}>${i}`, opts),
    );
    return cloneElement(element, undefined, transformed);
  }

  return node;
}

export function Tcy({
  children,
  className = 'tcy',
  as = 'span',
  ...tcyOptions
}: TcyProps): JSX.Element {
  const opts: TransformOptions = { className, tag: as, tcyOptions };
  return <>{transformNode(children, 'tcy', opts)}</>;
}
