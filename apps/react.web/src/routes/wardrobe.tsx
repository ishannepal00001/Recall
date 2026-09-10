import Layout from '../components/Layout'
import WardrobePage from '../pages/Wardrobe'
import { useWardrobeFacade } from '../facade/wardrobe'

export default function WardrobeRoute() {
  const facade = useWardrobeFacade()
  return (
    <Layout>
      <WardrobePage items={facade.items} isLoading={facade.list.isLoading} />
    </Layout>
  )
}
