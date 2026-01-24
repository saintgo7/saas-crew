'use client'

import { Certificate } from '@/lib/api/certificates'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Award, Download, Share2, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import { useToast } from '@/components/ui/Toast'

interface CertificateViewerProps {
  certificate: Certificate
}

export function CertificateViewer({ certificate }: CertificateViewerProps) {
  const { success, error, info } = useToast()

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      success('Certificate link copied to clipboard!')
    } catch {
      error('Failed to copy link')
    }
  }

  const handleDownload = () => {
    // TODO: Implement PDF download
    info('PDF download coming soon!')
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Actions */}
      <div className="flex justify-end gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
        <Button size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-1" />
          Download PDF
        </Button>
      </div>

      {/* Certificate */}
      <Card className="p-8 bg-gradient-to-br from-amber-50 to-orange-50 border-4 border-amber-200">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center border-4 border-amber-300">
              <Award className="h-10 w-10 text-amber-600" />
            </div>
          </div>
          <h1 className="text-3xl font-serif font-bold text-gray-800">
            Certificate of Completion
          </h1>
          <p className="text-muted-foreground mt-2">
            WKU Software Crew
          </p>
        </div>

        {/* Divider */}
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent my-6" />

        {/* Content */}
        <div className="text-center space-y-6">
          <p className="text-lg text-gray-600">This certifies that</p>
          <p className="text-3xl font-bold text-gray-800">
            {certificate.user?.name || 'Student'}
          </p>
          <p className="text-lg text-gray-600">
            has successfully completed the course
          </p>
          <p className="text-2xl font-semibold text-amber-700">
            {certificate.courseName}
          </p>
          <div className="flex justify-center">
            <span className="px-4 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
              Level: {certificate.courseLevel}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent my-6" />

        {/* Footer */}
        <div className="flex justify-between items-end text-sm text-gray-600">
          <div>
            <p className="font-medium">Certificate Number</p>
            <p className="font-mono">{certificate.certificateNumber}</p>
          </div>
          <div className="text-center">
            <div className="w-32 h-0.5 bg-gray-300 mb-2" />
            <p>Director of Education</p>
          </div>
          <div className="text-right">
            <p className="font-medium">Date of Issue</p>
            <p>{format(new Date(certificate.issuedAt), 'MMMM d, yyyy')}</p>
          </div>
        </div>

        {/* Verification Badge */}
        <div className="mt-6 pt-4 border-t border-amber-200">
          <div className="flex items-center justify-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Verified Certificate</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
