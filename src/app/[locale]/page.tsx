import { Language } from '@/lib/utils'
import HomeClient from './HomeClient'

export const revalidate = 60

export default function Home({ params }: { params: { locale: Language } }) {
  return <HomeClient locale={params.locale} />
}
