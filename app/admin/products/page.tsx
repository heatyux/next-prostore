import { getAllProducts } from '@/lib/actions/product.actions'

type AdminProductsPageProps = {
  searchParams: Promise<{
    query: string
    category: string
    page: string
  }>
}

const AdminProductsPage = async (props: AdminProductsPageProps) => {
  const searchparams = await props.searchParams
  const page = Number(searchparams.page) || 1
  const searhcText = searchparams.query || ''
  const category = searchparams.category || ''

  const products = await getAllProducts({
    query: searhcText,
    category,
    page,
  })

  console.log(products)

  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">Products</h1>
      </div>
    </div>
  )
}

export default AdminProductsPage
