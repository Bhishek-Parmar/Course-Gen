
// components/Tooltip.jsx
import { AnimatePresence, motion } from 'framer-motion';

export const Tooltip = ({ children, content, position = 'top' }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="relative inline-block">
            <div
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
            >
                {children}
            </div>
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: position === 'top' ? 10 : -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: position === 'top' ? 10 : -10 }}
                        className={`absolute z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded shadow-lg
                            ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}`}
                    >
                        {content}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};