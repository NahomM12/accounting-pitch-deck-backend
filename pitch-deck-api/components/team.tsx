"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Linkedin, Mail } from "lucide-react"

const team = [
  { 
    name: "Bemnet Abebe, ACCA", 
    role: "Founder and CEO", 
    expertise: "A strategic financial leader with nearly 10 years of experience in corporate finance and transaction advisory. Formerly a Senior Consultant at Grant Thornton and Verdant Consulting, she specializes in business valuation, financial modeling, and investment readiness. An ACCA member with a Bachelor's degree in Accounting and Finance from Addis Ababa University and a proven track record of supporting growth-stage businesses through outsourced CFO and strategic consulting services.", 
    image: "bemnet.webp",
    linkedin: "https://www.linkedin.com/in/bemnet-abebe-acca-966425158?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    email: "bemnet.abebe@ascendadvisoryet.com"
  },

  { 
    name: "Rebka Fekadu", 
    role: "Senior Financial Analyst", 
    expertise: "Experienced Finance and Tax Professional with 7+ years of expertise in accounting, taxation, and financial advisory. An MSc in Finance graduate and ACCA Part-Qualified. Worked at Grant Thornton, Verdant Consulting, and HST. Expert at guiding businesses through complex tax compliance, financial reporting, and regulatory requirements with strategic precision.", 
    image: "rebka.webp",
    linkedin: "https://www.linkedin.com/in/rebkafekadu?miniProfileUrn=urn%253Ali%253Afs_miniProfile%253AACoAACQrCSsBV_2WBWtpjad7Wf34glZ3C9Qfx6U&skipRedirect=true&miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAACQrCSsBV_2WBWtpjad7Wf34glZ3C9Qfx6U",
    
  },

  { 
    name: "Betelhem Desalegn", 
    role: "Financial Analyst", 
    expertise: "With more than 2 years experience in accounting and auditing service. Previously at TMS PLUS Firm with expertise in financial reporting, compliance and providing actionable insights for business decision making.", 
    image: "bethelhem.webp",
    linkedin: "https://et.linkedin.com/in/betelhemdesalegn?utm_source=share&utm_medium=member_mweb&utm_campaign=share_via&utm_content=profile",
    email: "bethelhem.desalegn@ascendadvisoryet.com"
  },

  { 
    name: "Sosina Kebede", 
    role: "Junior Financial Analyst", 
    expertise: "With experience at Habesha Cement and ongoing ACCA studies, she is building a strong foundation to grow into a well-rounded finance professional who consistently delivers results.", 
    image: "sosina2.webp",
    linkedin: "https://www.linkedin.com/in/sosina-kebede-a6ba8929b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
  }
]

export function Team() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  }

  return (
    <section id="team" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Our Team</h2>
          <p className="text-lg text-muted-foreground">Meet the professionals behind your success</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {team.map((member, i) => (
            <motion.div key={i} variants={itemVariants} whileHover={{ y: -8 }} className="group relative h-full">
              <div className="bento-card flex flex-col items-center text-center h-full group-hover:-translate-y-2">
                <div className="w-full h-56 md:h-64 lg:h-72 bg-transparent flex items-center justify-center p-4">
                  <div className="w-44 h-44 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full bg-white dark:bg-gray-800 overflow-hidden flex items-center justify-center ring-1 ring-white/10 shadow-md">
                    <Image
                      src={`/${member.image}`}
                      alt={member.name}
                      width={256}
                      height={256}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="p-2 flex-1 flex flex-col justify-center items-center text-center">
                  <h3 className="text-xl bento-title mb-1 text-center">{member.name}</h3>
                  <p className="text-primary font-semibold mb-3 text-center">{member.role}</p>
                  <p className="text-sm bento-text leading-relaxed max-w-prose whitespace-pre-wrap">{member.expertise}</p>

                  <div className="mt-6 flex gap-3 justify-center">
                    <a
                      href={member.linkedin || `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(member.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:opacity-90 transition"
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </a>

                    <a
                      href={member.email ? `mailto:${member.email}` : `mailto:info@ascend.com?subject=Contact%20${encodeURIComponent(member.name)}`}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-muted rounded-full text-sm font-medium hover:bg-muted/10 transition"
                    >
                      <Mail className="w-4 h-4" />
                      Email
                    </a>
                  </div>
                </div>
              </div>

            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
