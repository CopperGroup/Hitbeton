'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Percent, MoveRight, Pencil, BarChart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ProductType, ReadOnly } from '@/lib/types/types'
import { Store } from '@/constants/store'
import AnimatedNumber from '@/components/shared/AnimatedNumber'
import { getTopProductsBySales } from '@/lib/utils'
import { changeCategoryName, createNewCategory, getCategoriesNamesAndIds, moveProductsToCategory, setCategoryDiscount, updateCategories } from '@/lib/actions/categories.actions'
import ProductsTable from '@/components/shared/ProductsTable'
import { changeProductsCategory } from '@/lib/actions/product.actions'

// Commented out server actions
// import { changeProductsCategory, findAllProductsCategories, changeCategoryName } from "@/lib/actions/product.actions"
// import { setCategoryDiscount } from "@/lib/actions/categories.actions"
interface CategoryPageProps {
    _id: string,
    categoryName: string;
    totalProducts: number;
    totalValue: number;
    averageProductPrice: number;
    averageDiscountPercentage: number;
    stringifiedProducts: string; 
}

export default function EditCategoryPage(props : ReadOnly<CategoryPageProps>) {
  const [activeSection, setActiveSection] = useState<'main' | 'rename' | 'discount' | 'move'>('main')
  const [categoryName, setCategoryName] = useState("Example Category")
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryId, setNewCategoryId] = useState("")
  const [discountPercentage, setDiscountPercentage] = useState("0")
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [newCategory, setNewCategory] = useState(false);
  const [isDiscountInputFocused ,setIsDiscountInputFocused] = useState(false)
  const [allCategories, setAllCategories] = useState<{name: string, categoryId: string}[]>([]);
  const products: ProductType[] = JSON.parse(props.stringifiedProducts);
  const topProducts = getTopProductsBySales(products)

  useEffect(() => {
    const fetchAllCategories = async () => {
      const result = await getCategoriesNamesAndIds();

      setAllCategories(result)
    }

    fetchAllCategories();
  }, [])

  const handleConfirmChangeName = async () => {
    await changeCategoryName({ categoryId: props._id, newName: newCategoryName })
    setCategoryName(newCategoryName)
    setActiveSection('main')
  }

  const handleConfirmSetDiscount = async () => {
    await setCategoryDiscount({categoryId: props._id, percentage: parseFloat(discountPercentage)})
    setActiveSection('main')
  }

  const handleConfirmMoveProducts = async () => {
    if(!newCategory) {
      console.log("Id", newCategoryId)
      await moveProductsToCategory({ initialCategoryId: props._id, targetCategoryId: newCategoryId, productIds: Array.from(selectedProducts)})
    } else {
      console.log("Name", newCategoryName)
      await createNewCategory({ name: newCategoryName, products: products.filter(product => Array.from(selectedProducts).includes(product._id)), previousCategoryId: props._id})
    }
    setActiveSection('main')
  }

  const handleSelectionChange = (props: { selectType: "select-one" | "select-all", productId?: string, productIds?: string[] }) => {
    setSelectedProducts(prevSelected => {
      const newSelected = new Set(prevSelected)
      if (props.selectType === "select-all" && props.productIds) {
        if (newSelected.size === props.productIds.length) {
          newSelected.clear()
        } else {
          props.productIds.forEach(id => newSelected.add(id))
        }
      } else if (props.selectType === "select-one" && props.productId) {
        if (newSelected.has(props.productId)) {
          newSelected.delete(props.productId)
        } else {
          newSelected.add(props.productId)
        }
      }
      return newSelected
    })
  }

  return (
    <div className="min-h-screen pb-20">
      <h1 className="text-heading1-bold mb-8">Edit Category: {props.categoryName}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-heading3-bold">Category Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-base-semibold">Total Products:</span>
                <span className="text-base-medium"><AnimatedNumber number={props.totalProducts} duration={2000} easingName="easeOutExpo" /></span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-semibold">Average Price:</span>
                <span className="text-base-medium">{Store.currency_sign}<AnimatedNumber number={props.averageProductPrice} duration={2000} easingName="easeOutExpo" /></span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-semibold">Total Sales:</span>
                <span className="text-base-medium"><AnimatedNumber number={products.reduce((sum: number, product: ProductType) => sum + product.orderedBy.length, 0)} duration={2000} easingName="easeOutExpo" /></span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-heading3-bold">Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {topProducts.map((product) => (
                <li key={product.id} className="flex justify-between items-center">
                  <span className="text-base-semibold">{product.name}</span>
                  <span className="text-small-medium text-gray-600">{product.orderedBy.length} sales</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      {activeSection === 'main' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => setActiveSection('rename')}
            className="h-auto py-4 px-6 justify-start text-left bg-white hover:bg-gray-100 text-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex flex-col items-start">
              <span className="text-base-bold mb-1">Rename category</span>
              <span className="text-small-regular text-gray-600">Change the category name</span>
            </div>
            <Pencil className="w-5 h-5 ml-auto" />
          </Button>
          <Button
            onClick={() => setActiveSection('discount')}
            className="h-auto py-4 px-6 justify-start text-left bg-white hover:bg-gray-100 text-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex flex-col items-start">
              <span className="text-base-bold mb-1">Set category discount</span>
              <span className="text-small-regular text-gray-600">Apply a discount to all products</span>
            </div>
            <Percent className="w-5 h-5 ml-auto" />
          </Button>
          <Button
            onClick={() => setActiveSection('move')}
            className="h-auto py-4 px-6 justify-start text-left bg-white hover:bg-gray-100 text-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex flex-col items-start">
              <span className="text-base-bold mb-1">Move products</span>
              <span className="text-small-regular text-gray-600">Relocate products to another category</span>
            </div>
            <MoveRight className="w-5 h-5 ml-auto" />
          </Button>
        </div>
      )}

      {activeSection === 'rename' && (
        <Card className="rounded-xl shadow-sm pb-20 hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-heading3-bold">Rename Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 h-fit">
            <div>
              <Label htmlFor="newCategoryName" className="text-base-semibold mb-2 block">New Category Name</Label>
              <Input
                id="newCategoryName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter new category name"
                className="text-base-regular border-gray-300 focus:border-gray-400 rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setActiveSection('main')} className="text-base-medium">Cancel</Button>
              <Button onClick={handleConfirmChangeName} className="text-base-medium text-white">Confirm</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeSection === 'discount' && (
        <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-heading3-bold">Set Category Discount</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="discountPercentage" className="text-base-semibold mb-2 block">Discount Percentage</Label>
              <Input
                id="discountPercentage"
                value={isDiscountInputFocused ? discountPercentage : `${discountPercentage}%`}
                onChange={(e) => {
                  // Extract numeric part of the input value
                  const inputValue = e.target.value.replace('%', '');
                  let numericValue = parseFloat(inputValue);

                  // Ensure numeric value is valid
                  if (isNaN(numericValue)) {
                    numericValue = 0;
                  } else {
                    numericValue = Math.max(0, Math.min(100, numericValue)); // Clamp between 0 and 100
                  }

                  // Update state as a rounded number
                  setDiscountPercentage(numericValue.toFixed(0));
                }}
                onFocus={() => setIsDiscountInputFocused(true)}
                onBlur={() => setIsDiscountInputFocused(false)}
                placeholder="Enter discount percentage"
                className="text-base-regular border-gray-300 focus:border-gray-400 rounded-md"
              />
            </div>
            <div>
              <Label className="text-base-semibold mb-2 block">Discount Preview</Label>
              <Progress value={100 - parseFloat(discountPercentage)} className="h-2 bg-gray-200" />
              <span className="text-small-medium text-gray-600 mt-1 block">{Store.currency_sign}{props.averageProductPrice - props.averageProductPrice * (parseFloat(discountPercentage)) / 100} average price after discount</span>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setActiveSection('main')} className="text-base-medium">Cancel</Button>
              <Button onClick={handleConfirmSetDiscount} className="text-base-medium text-white">Confirm</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeSection === 'move' && (
        <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-heading3-bold">Move Products</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm py-4">
              <ProductsTable
                stringifiedProducts={props.stringifiedProducts} // Replace with actual products data
                categoryName={categoryName}
                selectedProducts={selectedProducts}
                onSelectionChange={handleSelectionChange}
              />
            </div>
            <div>
              <Label className="text-base-semibold mb-2 block">Destination Category</Label>
              {newCategory ? (
                <Input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter new category name"
                  className="text-base-regular border-gray-300 focus:border-gray-400 rounded-md"
                />
              ) : (
                <Select onValueChange={setNewCategoryId}>
                  <SelectTrigger className="text-base-regular">
                    <SelectValue placeholder="Choose existing category" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCategories.map((category, index) => (
                      <SelectItem key={index} value={category.categoryId} className="text-base-regular">{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <Button onClick={() => setNewCategory(!newCategory)} variant="outline" className="text-base-medium">
              {newCategory ? "Choose existing category" : "Create new category"}
            </Button>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setActiveSection('main')} className="text-base-medium">Cancel</Button>
              <Button onClick={handleConfirmMoveProducts} className="text-base-medium text-white">Confirm</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

