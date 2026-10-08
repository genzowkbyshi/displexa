"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface CtaBannerProps {
  title?: string;
  description?: string;
}

export default function CtaBanner({
  title = "Menünüzü Dijitalleştirmeye Hazır mısınız?",
  description = "Kredi kartı gerektirmeden hemen ücretsiz kayıt olun ve işletmenizin dijital menüsünü saniyeler içinde oluşturun.",
}: CtaBannerProps) {
  return (
    <section className="py-14 lg:py-18 px-6 sm:px-10 lg:px-14 xl:px-16 max-w-[1720px] mx-auto">
      <div className="bg-black text-white rounded-[28px] md:rounded-[40px] lg:rounded-[56px] 2xl:rounded-[70px] relative overflow-hidden flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center w-full relative z-10">
          
          {/* Left Content */}
          <div className="lg:col-span-6 p-6 sm:p-8 lg:p-0 lg:pl-10 xl:pl-16 2xl:pl-24 flex flex-col justify-center">
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-[24px] sm:text-[30px] lg:text-[36px] 2xl:text-[42px] font-medium tracking-tight text-white leading-[1.16] max-w-[460px]"
            >
              {title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-3.5 text-[13px] sm:text-[14px] lg:text-[15px] 2xl:text-[18px] font-normal text-gray-300 leading-relaxed max-w-[460px]"
            >
              {description}
            </motion.p>

            {/* Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-6 sm:mt-7"
            >
              <Link
                href="/onboarding"
                className="inline-flex w-full sm:w-[260px] h-[42px] sm:h-[44px] rounded-full bg-white hover:bg-neutral-200 text-black text-[14px] sm:text-[15px] font-medium items-center justify-center hover:shadow-lg transition-all hover:scale-105 active:scale-95 text-center"
              >
                Ücretsiz Hesabınızı Oluşturun
              </Link>
            </motion.div>
          </div>

          {/* Right Photo Graphic */}
          <div className="lg:col-span-6 p-2 sm:p-3 lg:p-4 lg:pr-5 2xl:p-6 2xl:pr-8 flex items-center justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="w-full flex justify-end"
            >
              <img
                src="/images/cta_banner.png"
                alt="QR Menü Kullanımı"
                className="w-full h-auto max-h-[380px] sm:max-h-[460px] lg:max-h-[520px] 2xl:max-h-[600px] object-contain object-right rounded-[18px] sm:rounded-[24px] lg:rounded-[36px] 2xl:rounded-[50px] drop-shadow-2xl"
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
