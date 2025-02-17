// hooks/useAnimations.js
import { useEffect } from 'react';
import { useAnimate } from 'framer-motion';

export const useShakeAnimation = () => {
    const [scope, animate] = useAnimate();

    const shake = () => {
        animate(scope.current, 
            { x: [-10, 10, -10, 10, 0] },
            { duration: 0.5, type: "spring" }
        );
    };

    return [scope, shake];
};

export const useTypewriter = (text, duration = 2) => {
    const [scope, animate] = useAnimate();

    useEffect(() => {
        const characters = text.split('');
        const sequence = characters.map((char, index) => [
            scope.current,
            { text: text.slice(0, index + 1) },
            { duration: duration / characters.length }
        ]);

        animate(sequence);
    }, [text, duration, animate, scope]);

    return scope;
};