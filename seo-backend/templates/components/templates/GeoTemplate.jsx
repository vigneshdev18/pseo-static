import Navbar from '../sections/Navbar';
import HeroRich from '../sections/HeroRich';
import TrustedBy from '../sections/TrustedBy';
import Stats from '../sections/Stats';
import Features from '../sections/Features';
import Benefits from '../sections/Benefits';
import DataHighlights from '../sections/DataHighlights';
import IndustriesRich from '../sections/IndustriesRich';
import Workflow from '../sections/Workflow';
import Compliance from '../sections/Compliance';
import Reviews from '../sections/Reviews';
import ComparisonRich from '../sections/ComparisonRich';
import ContentBlock from '../sections/ContentBlock';
import Banner from '../sections/Banner';
import TrialCTA from '../sections/TrialCTA';
import FAQRich from '../sections/FAQRich';
import CTABanner from '../sections/CTABanner';
import Footer from '../sections/Footer';

export default function GeoTemplate({ sections }) {
  const v = sections.visibility ?? {};
  const show = (key, defaultOn = true) => (v[key] === undefined ? defaultOn : v[key]);
  return (
    <>
      <Navbar />
      {show('hero') && sections.hero && <HeroRich {...sections.hero} />}
      {show('trusted_by') && sections.trusted_by && <TrustedBy {...sections.trusted_by} />}
      {show('stats') && sections.stats && <Stats {...sections.stats} />}
      {show('features') && sections.features && <Features {...sections.features} />}
      {show('benefits') && sections.benefits && <Benefits {...sections.benefits} />}
      {show('data_highlights') && sections.data_highlights && <DataHighlights {...sections.data_highlights} />}
      {show('industries') && sections.industries && <IndustriesRich {...sections.industries} />}
      {show('workflow') && sections.workflow && <Workflow {...sections.workflow} />}
      {show('compliance') && sections.compliance && <Compliance {...sections.compliance} />}
      {show('reviews') && sections.reviews && <Reviews {...sections.reviews} />}
      {show('comparison') && sections.comparison && <ComparisonRich {...sections.comparison} />}
      {show('content') && sections.content && <ContentBlock {...sections.content} />}
      {show('visual_banner') && sections.banner && <Banner {...sections.banner} />}
      {show('trial_cta') && sections.trial_cta && <TrialCTA {...sections.trial_cta} />}
      {show('faq') && sections.faq && <FAQRich {...sections.faq} />}
      {show('cta') && sections.cta && <CTABanner {...sections.cta} />}
      <Footer />
    </>
  );
}
