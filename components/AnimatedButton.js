// components/AnimatedButton.jsx
import { motion } from 'framer-motion';

export const AnimatedButton = ({ children, onClick, disabled, className }) => {
    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            className={className}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                type: "spring",
                stiffness: 500,
                damping: 30
            }}
        >
            {children}
        </motion.button>
    );
};

