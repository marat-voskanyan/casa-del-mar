import type { Metadata } from 'next'
import Link from 'next/link'
import AdminNav from '@/components/admin/AdminNav'
import PropertyForm from '@/components/admin/PropertyForm'

export const metadata: Metadata = { title: 'Add Property' }

export default function NewPropertyPage() {
  return (
    <div className="flex">
      <AdminNav />
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Link href="/admin" className="text-sm text-gray-400 hover:text-navy transition-colors">
              ← Properties
            </Link>
            <span className="text-gray-300">/</span>
            <h1 className="font-serif text-2xl text-navy font-light">Add Property</h1>
          </div>

          <div className="bg-white rounded shadow-sm p-6">
            <PropertyForm mode="create" />
          </div>
        </div>
      </div>
    </div>
  )
}
