import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BrainCircuit, CheckCircle2, XCircle, Rocket, MapPin, Settings2 } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FormField, FormInput, FormSelect } from '@/components/ui/form-field'
import { ErrorState } from '@/components/StateMessages'
import { SuccessGauge } from '@/components/SuccessGauge'
import { PREDICTION_FORM_OPTIONS } from '@/data/predictionOptions'
import { predictionApi, getErrorMessage } from '@/services/api'
import type { PredictionRequest, PredictionResponse } from '@/types/dashboard'

const defaultForm: PredictionRequest = {
  Agency: 'NASA',
  Agency_Type: 1,
  Program_Type: 'Robotic',
  Mission_Category: 'Mars',
  Sub_Category: 'Rover',
  Launch_Vehicle: 'Falcon 9',
  Launch_Site: 'Cape Canaveral',
  Crew_Type: 'Uncrewed',
  Destination: 'Mars',
  Cost_USD_Million: 500,
  Launch_Year: 2026,
  Country_Region: 'USA',
}

function FormSection({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-purple-300 border-b border-purple-500/20 pb-2">
        <Icon className="h-4 w-4" />
        {title}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </div>
  )
}

export function PredictionPage() {
  const [form, setForm] = useState<PredictionRequest>(defaultForm)
  const [result, setResult] = useState<PredictionResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = <K extends keyof PredictionRequest>(key: K, value: PredictionRequest[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const response = await predictionApi.predictSuccess(form)
      setResult(response)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-16 max-w-5xl">
      <PageHeader
        icon={BrainCircuit}
        title="Mission Success Prediction"
        description="Predict mission outcome using the trained CatBoost model."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card-hover">
          <CardHeader>
            <CardTitle>Mission Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormSection title="Agency & Program" icon={Settings2}>
                <FormField label="Agency">
                  <FormSelect value={form.Agency} onChange={(v) => update('Agency', v)} options={PREDICTION_FORM_OPTIONS.agencies} />
                </FormField>
                <FormField label="Agency Type">
                  <FormSelect value={form.Agency_Type} onChange={(v) => update('Agency_Type', Number(v))} options={PREDICTION_FORM_OPTIONS.agencyTypes} />
                </FormField>
                <FormField label="Program Type">
                  <FormSelect value={form.Program_Type} onChange={(v) => update('Program_Type', v)} options={PREDICTION_FORM_OPTIONS.programTypes} />
                </FormField>
                <FormField label="Country">
                  <FormSelect value={form.Country_Region} onChange={(v) => update('Country_Region', v)} options={PREDICTION_FORM_OPTIONS.countries} />
                </FormField>
              </FormSection>

              <FormSection title="Mission Details" icon={Rocket}>
                <FormField label="Mission Category">
                  <FormSelect value={form.Mission_Category} onChange={(v) => update('Mission_Category', v)} options={PREDICTION_FORM_OPTIONS.missionCategories} />
                </FormField>
                <FormField label="Sub Category" className="sm:col-span-2">
                  <FormSelect value={form.Sub_Category} onChange={(v) => update('Sub_Category', v)} options={PREDICTION_FORM_OPTIONS.subCategories} />
                </FormField>
                <FormField label="Crew Type">
                  <FormSelect value={form.Crew_Type} onChange={(v) => update('Crew_Type', v)} options={PREDICTION_FORM_OPTIONS.crewTypes} />
                </FormField>
                <FormField label="Destination">
                  <FormSelect value={form.Destination} onChange={(v) => update('Destination', v)} options={PREDICTION_FORM_OPTIONS.destinations} />
                </FormField>
              </FormSection>

              <FormSection title="Launch & Budget" icon={MapPin}>
                <FormField label="Launch Vehicle">
                  <FormSelect value={form.Launch_Vehicle} onChange={(v) => update('Launch_Vehicle', v)} options={PREDICTION_FORM_OPTIONS.launchVehicles} />
                </FormField>
                <FormField label="Launch Site">
                  <FormSelect value={form.Launch_Site} onChange={(v) => update('Launch_Site', v)} options={PREDICTION_FORM_OPTIONS.launchSites} />
                </FormField>
                <FormField label="Cost (USD Million)">
                  <FormInput type="number" value={form.Cost_USD_Million} onChange={(v) => update('Cost_USD_Million', Number(v))} min={0} step={0.1} />
                </FormField>
                <FormField label="Launch Year">
                  <FormInput type="number" value={form.Launch_Year} onChange={(v) => update('Launch_Year', Number(v))} min={1950} max={2100} />
                </FormField>
              </FormSection>

              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? 'Predicting...' : 'Predict Success'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {error && <ErrorState message={error} />}

          {!result && !loading && !error && (
            <Card className="glass-card-hover">
              <CardContent className="py-12 text-center text-slate-400">
                Submit mission parameters to see the prediction result.
              </CardContent>
            </Card>
          )}

          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <Card
                  className={
                    result.prediction === 'Success'
                      ? 'border-green-500/30 glass-card-hover'
                      : 'border-red-500/30 glass-card-hover'
                  }
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      {result.prediction === 'Success' ? (
                        <CheckCircle2 className="h-12 w-12 text-green-400" />
                      ) : (
                        <XCircle className="h-12 w-12 text-red-400" />
                      )}
                      <div>
                        <p className="text-sm text-slate-400">Predicted Outcome</p>
                        <p className={`text-2xl font-bold ${result.prediction === 'Success' ? 'text-green-400' : 'text-red-400'}`}>
                          {result.prediction}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <SuccessGauge percentage={result.success_probability} />

                <Card className="glass-card-hover">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Success Probability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProgressBar
                      value={result.success_probability}
                      colorClass={result.success_probability >= 50 ? 'bg-green-500' : 'bg-red-500'}
                      label={`${result.success_probability.toFixed(2)}% probability of success`}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
