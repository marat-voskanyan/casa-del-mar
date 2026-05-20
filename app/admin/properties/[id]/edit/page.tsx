import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AdminNav from '@/components/admin/AdminNav'
import PropertyForm from '@/components/admin/PropertyForm'
import { getPropertyById } from '@/lib/db'
import type { Property } from '@/types'

interface Props { params: { id: string } }

export const metadata: Metadata = { title: 'Edit Property' }

export default async function EditPropertyPage({ params: { id } }: Props) {
  let property: Property | null = null
  try { property = await getPropertyById(Number(id)) as unknown as Property } catch { /* */ }
  if (!property) notFound()

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
            <h1 className="font-serif text-2xl text-navy font-light">
              Edit: {property.name}
            </h1>
          </div>

          <div className="bg-white rounded shadow-sm p-6">
            <PropertyForm mode="edit" initial={property} />
          </div>
        </div>
      </div>
    </div>
  )
}
