import { motion } from 'motion/react';
import { SKILL_GROUPS } from '../../../constants/timeline';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };

export function SkillsSection() {
  return (
    <section
      id="skills"
      className="scroll-mt-24 px-6 md:px-12 lg:px-20 py-20 md:py-28 border-t border-neutral-200"
    >
      <div className="max-w-5xl mx-auto">
        <motion.p
          className="font-mono text-[13px] text-portfolio uppercase tracking-[0.35em] mb-10 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
        >
          ▸ Skills
        </motion.p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10 max-w-3xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
        >
          {SKILL_GROUPS.map((group) => (
            <motion.div key={group.label} variants={fadeUp}>
              <h3 className="text-sm font-bold text-neutral-900 mb-4">{group.label}</h3>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono text-[11px] text-neutral-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
