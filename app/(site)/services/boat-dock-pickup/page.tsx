import SeoServiceLandingPage from '../_components/SeoServiceLandingPage';
import { getSeoServicePage, makeSeoServiceMetadata } from '../_data/seoServicePages';

const page = getSeoServicePage('boat-dock-pickup');

export const metadata = makeSeoServiceMetadata(page);

export default function Page() {
  return <SeoServiceLandingPage page={page} />;
}
