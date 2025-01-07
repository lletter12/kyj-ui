/* eslint-disable @typescript-eslint/no-explicit-any */

import {DependencyList, EffectCallback, useEffect, useRef} from "react";
import {getElementTarget, TargetType} from "../../utils/getElementTarget/getElementTarget.ts";
import {isSameDepth} from "../../utils/isSameDepth/isSameDepth.ts";
import {useUnmount} from "../useUnmount/useUnmount.ts";

export const useEffectWithTarget = (
    effect: EffectCallback,
    deps: DependencyList,
    target: TargetType<any> | TargetType<any>[],
) => {
    const hasInitRef = useRef(false);

    const lastElementRef = useRef<(Element | null)[]>([]);
    const lastDepsRef = useRef<DependencyList>([]);

    const unLoadRef = useRef<any>();

    useEffect(() => {
        const targets = Array.isArray(target) ? target : [target];
        const els = targets.map((item) => getElementTarget(item));

        if (!hasInitRef.current) {
            hasInitRef.current = true;
            lastElementRef.current = els;
            lastDepsRef.current = deps;

            unLoadRef.current = effect();
            return;
        }

        if (
            els.length !== lastElementRef.current.length ||
            !isSameDepth(lastElementRef.current, els) ||
            !isSameDepth(lastDepsRef.current, deps)
        ) {
            unLoadRef.current?.();

            lastElementRef.current = els;
            lastDepsRef.current = deps;
            unLoadRef.current = effect();
        }
    });

    useUnmount(() => {
        unLoadRef.current?.();
        hasInitRef.current = false;
    });
};