'use client'

import { useState } from 'react'
import {
  verifyCertificate,
  CertificateVerification,
} from '@/lib/api/certificates'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, CheckCircle, XCircle, Award, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { useToast } from '@/components/ui/Toast'

export function CertificateVerifier() {
  const [certificateNumber, setCertificateNumber] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [result, setResult] = useState<CertificateVerification | null>(null)
  const { error } = useToast()

  const handleVerify = async () => {
    if (!certificateNumber.trim()) {
      error('Please enter a certificate number')
      return
    }

    setIsVerifying(true)
    try {
      const verification = await verifyCertificate(certificateNumber.trim())
      setResult(verification)
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Verification failed'
      error(errorMessage)
      setResult(null)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerify()
    }
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Verify Certificate
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Enter certificate number (e.g., CERT-2026-ABCD1234)"
            value={certificateNumber}
            onChange={(e) => setCertificateNumber(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleVerify} disabled={isVerifying}>
            {isVerifying ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Result */}
        {result && (
          <div
            className={`p-4 rounded-lg ${
              result.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              {result.valid ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-700">
                    Valid Certificate
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="font-semibold text-red-700">
                    Invalid Certificate
                  </span>
                </>
              )}
            </div>

            {result.valid && result.certificate && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Holder:</span>
                  <span className="font-medium">{result.certificate.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Course:</span>
                  <span className="font-medium">{result.certificate.courseName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Level:</span>
                  <Badge variant="outline">{result.certificate.courseLevel}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Issued:</span>
                  <span>
                    {format(new Date(result.certificate.issuedAt), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            )}

            {!result.valid && result.message && (
              <p className="text-sm text-red-600">{result.message}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
