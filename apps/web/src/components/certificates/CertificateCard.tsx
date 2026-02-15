'use client'

import { Certificate } from '@/lib/api/certificates'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Award, Calendar, ExternalLink, Download } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import Link from 'next/link'

interface CertificateCardProps {
  certificate: Certificate
  onView?: () => void
}

export function CertificateCard({ certificate, onView }: CertificateCardProps) {
  const issuedDate = new Date(certificate.issuedAt)

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-2" />
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <Award className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">
              {certificate.courseName}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">{certificate.courseLevel}</Badge>
              <span className="text-sm text-muted-foreground">
                {certificate.certificateNumber}
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
              <Calendar className="h-3 w-3" />
              <span>
                Issued {formatDistanceToNow(issuedDate, { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          {onView ? (
            <Button variant="outline" size="sm" onClick={onView} className="flex-1">
              <ExternalLink className="h-4 w-4 mr-1" />
              View
            </Button>
          ) : (
            <Link href={`/certificates/${certificate.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="h-4 w-4 mr-1" />
                View
              </Button>
            </Link>
          )}
          <Button variant="outline" size="sm" className="flex-1">
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
