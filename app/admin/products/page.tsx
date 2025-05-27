import DeleteDialog from '@/components/shared/delete-dialog'
import Pagination from '@/components/shared/pagination'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { deleteProduct, getAllProducts } from '@/lib/actions/product.actions'
import { formatCurrency, formatId } from '@/lib/utils'
import Link from 'next/link'

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

  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">Products</h1>
        <Button asChild>
          <Link href="/product/products/create">Create Product</Link>
        </Button>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead className="text-right">PRICE</TableHead>
              <TableHead>CATEGORY</TableHead>
              <TableHead>STOCK</TableHead>
              <TableHead>RATING</TableHead>
              <TableHead className="w-[100px]">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.data.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{formatId(product.id)}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(product.price)}
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.rating}</TableCell>
                <TableCell className="flex gap-1">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/products/${product.id}`}>Edit</Link>
                  </Button>
                  <DeleteDialog id={product.id} action={deleteProduct} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {products.totalPage > 1 && (
          <Pagination page={page} totalPages={products.totalPage} />
        )}
      </div>
    </div>
  )
}

export default AdminProductsPage
