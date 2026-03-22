import React from 'react';
import type { FlyingBadge } from './types';

interface FlyingBadgeDisplayProps {
    badge: FlyingBadge | null;
    styles: { readonly [key: string]: string };
}

export default function FlyingBadgeDisplay({ badge, styles }: FlyingBadgeDisplayProps) {
    if (!badge) return null;
    return (
        <div
            key={badge.id}
            className={styles.flyingBadge}
            style={{
                left: badge.moving ? badge.endX : badge.startX,
                top: badge.moving ? badge.endY : badge.startY,
            }}
        >
            {badge.value}
        </div>
    );
}
