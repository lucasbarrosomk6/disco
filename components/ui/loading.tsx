import * as Progress from '@radix-ui/react-progress';
import { motion } from 'framer-motion';

export function Loading() {
  return (
    <div className="flex justify-center items-center h-full">
      <Progress.Root className="relative overflow-hidden bg-gray-200 rounded-full w-56 h-6">
        <Progress.Indicator asChild>
          <motion.div
            className="bg-blue-500 w-full h-full"
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          />
        </Progress.Indicator>
      </Progress.Root>
    </div>
  );
}