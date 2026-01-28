import React from 'react';
import { useTranslation, Trans } from 'react-i18next';

export interface ExtendedInfoData {
    title: string;
    subtitle: string;
    content: React.ReactNode;
}

export const useExtendedInfo = (): Record<string, ExtendedInfoData> => {
    const { t } = useTranslation();

    return {
        'palace': {
            title: t('extended.palace.title'),
            subtitle: t('extended.palace.subtitle'),
            content: (
                <div className="space-y-6 text-gray-800">
                    <section>
                        <h3 className="text-xl font-bold text-[#8a1c1c] mb-2 uppercase border-b border-[#d4af37] pb-1">{t('extended.palace.s1.title')}</h3>
                        <p>
                            <Trans i18nKey="extended.palace.s1.p1" components={{ strong: <strong /> }} />
                        </p>
                        <p className="mt-2">
                            <Trans i18nKey="extended.palace.s1.p2" components={{ strong: <strong /> }} />
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-[#8a1c1c] mb-2 uppercase border-b border-[#d4af37] pb-1">{t('extended.palace.s2.title')}</h3>
                        <p>
                            <Trans i18nKey="extended.palace.s2.p1" />
                        </p>
                        <div className="bg-[#eaddcf] p-4 rounded-lg mt-4 border border-[#c5a059]">
                            <h4 className="font-bold mb-2 text-sm uppercase">{t('extended.palace.s2.box_title')}</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                                <li><Trans i18nKey="extended.palace.s2.l1" components={{ strong: <strong /> }} /></li>
                                <li><Trans i18nKey="extended.palace.s2.l2" components={{ strong: <strong /> }} /></li>
                                <li><Trans i18nKey="extended.palace.s2.l3" components={{ strong: <strong /> }} /></li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-[#8a1c1c] mb-2 uppercase border-b border-[#d4af37] pb-1">{t('extended.palace.s3.title')}</h3>
                        <p>
                            {t('extended.palace.s3.p1')}
                        </p>
                        <p className="font-serif text-center text-lg my-4 italic font-bold text-[#8a7224]">
                            <Trans i18nKey="extended.palace.s3.quote" components={{ br: <br /> }} />
                        </p>
                        <p>
                            <Trans i18nKey="extended.palace.s3.p2" components={{ strong: <strong /> }} />
                        </p>
                    </section>
                </div>
            )
        },
        'san_pedro': {
            title: t('extended.san_pedro.title'),
            subtitle: t('extended.san_pedro.subtitle'),
            content: (
                <div className="space-y-6 text-gray-800">
                    <section>
                        <h3 className="text-xl font-bold text-[#8a1c1c] mb-2 uppercase border-b border-[#d4af37] pb-1">{t('extended.san_pedro.s1.title')}</h3>
                        <p>
                            <Trans i18nKey="extended.san_pedro.s1.p1" components={{ strong: <strong /> }} />
                        </p>
                        <p className="mt-2">
                            <Trans i18nKey="extended.san_pedro.s1.p2" components={{ strong: <strong /> }} />
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-[#8a1c1c] mb-2 uppercase border-b border-[#d4af37] pb-1">{t('extended.san_pedro.s2.title')}</h3>
                        <p>
                            {t('extended.san_pedro.s2.p1')}
                        </p>
                        <div className="bg-[#eaddcf] p-4 rounded-lg mt-4 border border-[#c5a059]">
                            <p className="text-sm">
                                <Trans i18nKey="extended.san_pedro.s2.box_p1" components={{ strong: <strong /> }} />
                            </p>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-[#8a1c1c] mb-2 uppercase border-b border-[#d4af37] pb-1">{t('extended.san_pedro.s3.title')}</h3>
                        <p>
                            {t('extended.san_pedro.s3.p1')}
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-sm mt-3">
                            <li><Trans i18nKey="extended.san_pedro.s3.l1" components={{ strong: <strong /> }} /></li>
                            <li><Trans i18nKey="extended.san_pedro.s3.l2" components={{ strong: <strong /> }} /></li>
                            <li><Trans i18nKey="extended.san_pedro.s3.l3" components={{ strong: <strong /> }} /></li>
                        </ul>
                    </section>
                </div>
            )
        },
        'sepulchre': {
            title: t('extended.sepulchre.title'),
            subtitle: t('extended.sepulchre.subtitle'),
            content: (
                <div className="space-y-6 text-gray-800">
                    <section>
                        <h3 className="text-xl font-bold text-[#8a1c1c] mb-2 uppercase border-b border-[#d4af37] pb-1">{t('extended.sepulchre.s1.title')}</h3>
                        <p>
                            {t('extended.sepulchre.s1.p1')}
                        </p>
                        <div className="bg-[#eaddcf] p-4 rounded-lg mt-4 border border-[#c5a059] space-y-3">
                            <div>
                                <h4 className="font-bold text-[#8a1c1c] text-sm">{t('extended.sepulchre.s1.box_t1')}</h4>
                                <p className="text-sm">
                                    <Trans i18nKey="extended.sepulchre.s1.box_p1" components={{ strong: <strong /> }} />
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-[#8a1c1c] text-sm">{t('extended.sepulchre.s1.box_t2')}</h4>
                                <p className="text-sm">
                                    <Trans i18nKey="extended.sepulchre.s1.box_p2" components={{ strong: <strong />, br: <br /> }} />
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-[#8a1c1c] text-sm">{t('extended.sepulchre.s1.box_t3')}</h4>
                                <p className="text-sm">
                                    {t('extended.sepulchre.s1.box_p3')}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-[#8a1c1c] mb-2 uppercase border-b border-[#d4af37] pb-1">{t('extended.sepulchre.s2.title')}</h3>
                        <p>
                            <Trans i18nKey="extended.sepulchre.s2.p1" components={{ strong: <strong /> }} />
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-sm mt-3">
                            <li><Trans i18nKey="extended.sepulchre.s2.l1" components={{ strong: <strong /> }} /></li>
                            <li><Trans i18nKey="extended.sepulchre.s2.l2" components={{ strong: <strong /> }} /></li>
                            <li><Trans i18nKey="extended.sepulchre.s2.l3" components={{ strong: <strong /> }} /></li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-[#8a1c1c] mb-2 uppercase border-b border-[#d4af37] pb-1">{t('extended.sepulchre.s3.title')}</h3>
                        <p className="text-sm">
                            <Trans i18nKey="extended.sepulchre.s3.p1" components={{ strong: <strong /> }} />
                        </p>
                    </section>

                    <section className="pt-4 border-t border-[#d4af37]">
                        <a
                            href="https://www.youtube.com/watch?v=igU_UnnRzAw"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 w-full bg-[#8a1c1c] text-[#fcf5e5] py-3 rounded-lg font-bold uppercase tracking-widest hover:bg-[#5c1212] transition-colors shadow-lg"
                        >
                            <span>📺</span> {t('extended.sepulchre.video_btn')}
                        </a>
                        <p className="text-center text-xs mt-2 italic text-gray-600">{t('extended.sepulchre.video_note')}</p>
                    </section>
                </div>
            )
        },
        'chrismon': {
            title: t('extended.chrismon.title'),
            subtitle: t('extended.chrismon.subtitle'),
            content: (
                <div className="space-y-6 text-gray-800">
                    <div className="text-center mb-6">
                        <span className="text-6xl font-serif text-[#d4af37]">☧</span>
                    </div>
                    <p>
                        <Trans i18nKey="extended.chrismon.p1" components={{ strong: <strong /> }} />
                    </p>
                    <div className="bg-[#eaddcf] p-4 rounded-lg border border-[#c5a059]">
                        <p className="text-sm italic">
                            {t('extended.chrismon.quote')}
                        </p>
                    </div>
                    <p>
                        <Trans i18nKey="extended.chrismon.p2" components={{ strong: <strong /> }} />
                    </p>
                    <p className="text-sm text-gray-600 border-t border-gray-400 pt-2 mt-4">
                        {t('extended.chrismon.note')}
                    </p>
                </div>
            )
        },
        'jus_castillo': {
            title: t('extended.jus_castillo.title'),
            subtitle: t('extended.jus_castillo.subtitle'),
            content: (
                <div className="space-y-6 text-gray-800 text-base">
                    <section>
                        <h3 className="text-xl font-bold text-[#8a1c1c] mb-2 uppercase border-b border-[#d4af37] pb-1">{t('extended.jus_castillo.s1.title')}</h3>
                        <p>
                            <Trans i18nKey="extended.jus_castillo.s1.p1" components={{ strong: <strong /> }} />
                        </p>
                        <p className="mt-2">
                            <Trans i18nKey="extended.jus_castillo.s1.p2" components={{ strong: <strong /> }} />
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-[#8a1c1c] mb-2 uppercase border-b border-[#d4af37] pb-1">{t('extended.jus_castillo.s2.title')}</h3>
                        <p>
                            {t('extended.jus_castillo.s2.p1')}
                        </p>
                        <p className="mt-2">
                            <Trans i18nKey="extended.jus_castillo.s2.p2" components={{ strong: <strong /> }} />
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-[#8a1c1c] mb-2 uppercase border-b border-[#d4af37] pb-1">{t('extended.jus_castillo.s3.title')}</h3>
                        <p>
                            <Trans i18nKey="extended.jus_castillo.s3.p1" components={{ strong: <strong /> }} />
                        </p>
                        <div className="bg-[#eaddcf] p-4 rounded-lg mt-4 border border-[#c5a059]">
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                                <li><Trans i18nKey="extended.jus_castillo.s3.l1" components={{ strong: <strong /> }} /></li>
                                <li><Trans i18nKey="extended.jus_castillo.s3.l2" components={{ strong: <strong /> }} /></li>
                                <li><Trans i18nKey="extended.jus_castillo.s3.l3" components={{ strong: <strong /> }} /></li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-[#8a1c1c] mb-2 uppercase border-b border-[#d4af37] pb-1">{t('extended.jus_castillo.s4.title')}</h3>
                        <p>
                            <Trans i18nKey="extended.jus_castillo.s4.p1" components={{ strong: <strong /> }} />
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-[#8a1c1c] mb-2 uppercase border-b border-[#d4af37] pb-1">{t('extended.jus_castillo.s5.title')}</h3>
                        <p>
                            <Trans i18nKey="extended.jus_castillo.s5.p1" components={{ strong: <strong /> }} />
                        </p>
                    </section>
                </div>
            )
        },
        'star_symbol': {
            title: t('extended.star_symbol.title'),
            subtitle: t('extended.star_symbol.subtitle'),
            content: (
                <div className="space-y-6 text-gray-800">
                    <section>
                        <h3 className="text-xl font-bold text-[#8a1c1c] mb-2 uppercase border-b border-[#d4af37] pb-1">{t('extended.star_symbol.s1.title')}</h3>
                        <p>
                            <Trans i18nKey="extended.star_symbol.s1.p1" components={{ strong: <strong />, em: <em /> }} />
                        </p>
                        <p className="mt-2 text-lg font-serif italic text-center text-[#8a7224]">
                            {t('extended.star_symbol.s1.quote')}
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-[#8a1c1c] mb-2 uppercase border-b border-[#d4af37] pb-1">{t('extended.star_symbol.s2.title')}</h3>
                        <p>
                            <Trans i18nKey="extended.star_symbol.s2.p1" components={{ strong: <strong /> }} />
                        </p>
                        <div className="bg-[#eaddcf] p-4 rounded-lg mt-4 border border-[#c5a059]">
                            <p className="text-sm">
                                {t('extended.star_symbol.s2.box_p1')}
                            </p>
                        </div>
                        <p className="mt-4 text-sm text-gray-600">
                            {t('extended.star_symbol.s2.note')}
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-[#8a1c1c] mb-2 uppercase border-b border-[#d4af37] pb-1">{t('extended.star_symbol.s3.title')}</h3>
                        <div className="flex flex-col items-center mb-4">
                            <span className="text-6xl text-[#d4af37] drop-shadow-md">✴</span>
                        </div>
                        <ul className="list-disc pl-5 space-y-2 text-sm">
                            <li><Trans i18nKey="extended.star_symbol.s3.l1" components={{ strong: <strong /> }} /></li>
                            <li><Trans i18nKey="extended.star_symbol.s3.l2" components={{ strong: <strong /> }} /></li>
                            <li><Trans i18nKey="extended.star_symbol.s3.l3" components={{ strong: <strong /> }} /></li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-[#8a1c1c] mb-2 uppercase border-b border-[#d4af37] pb-1">{t('extended.star_symbol.s4.title')}</h3>
                        <p>
                            {t('extended.star_symbol.s4.p1')}
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-sm mt-3">
                            <li><Trans i18nKey="extended.star_symbol.s4.l1" components={{ strong: <strong /> }} /></li>
                            <li><Trans i18nKey="extended.star_symbol.s4.l2" /></li>
                            <li>{t('extended.star_symbol.s4.l3')}</li>
                        </ul>
                    </section>
                </div>
            )
        }
    };
};
