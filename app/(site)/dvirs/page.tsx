'use client'

import { useState, useEffect } from 'react'

interface Defect {
  id: string
  description: string
  location: string
  severity: 'critical' | 'major' | 'minor'
  status: 'open' | 'in_progress' | 'corrected' | 'deferred'
  identifiedDate: string
  carriedOverCount: number
}

interface Vehicle {
  id: string
  name: string
}

export default function DVIRsPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<string>('')
  const [uncorrectedDefects, setUncorrectedDefects] = useState<Defect[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Fetch vehicles on mount (you'll need to implement a vehicles API endpoint)
  useEffect(() => {
    fetchVehicles()
  }, [])

  // Fetch uncorrected defects when vehicle is selected
  useEffect(() => {
    if (selectedVehicle) {
      fetchUncorrectedDefects(selectedVehicle)
    }
  }, [selectedVehicle])

  const fetchVehicles = async () => {
    try {
      // This assumes you have an API endpoint to fetch vehicles
      // For now, we'll use the Payload API directly
      const response = await fetch('/api/payload/vehicles?limit=100')
      const data = await response.json()
      setVehicles(data.docs || [])
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    }
  }

  const fetchUncorrectedDefects = async (vehicleId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/dvirs/get-uncorrected-defects?vehicleId=${vehicleId}`)
      const data = await response.json()
      setUncorrectedDefects(data.defects || [])
    } catch (error) {
      console.error('Error fetching defects:', error)
      setMessage('Error loading defects')
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'major':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'minor':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Driver Vehicle Inspection Reports (DVIR)
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            View uncorrected defects and submit vehicle inspections
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Vehicle Selection */}
          <div className="mb-8">
            <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Vehicle
            </label>
            <select
              id="vehicle"
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="w-full max-w-md px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="">-- Select a Vehicle --</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Message */}
          {message && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-blue-800 dark:text-blue-200">{message}</p>
            </div>
          )}

          {/* Uncorrected Defects */}
          {selectedVehicle && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Uncorrected Defects for Selected Vehicle
              </h2>

              {loading ? (
                <p className="text-gray-600 dark:text-gray-400">Loading defects...</p>
              ) : uncorrectedDefects.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    No uncorrected defects for this vehicle. Great job!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-yellow-800 dark:text-yellow-200 font-semibold">
                      ⚠️ These defects will automatically carry over to new DVIRs until corrected
                    </p>
                  </div>

                  {uncorrectedDefects.map((defect) => (
                    <div
                      key={defect.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${getSeverityColor(
                                defect.severity
                              )}`}
                            >
                              {defect.severity.toUpperCase()}
                            </span>
                            {defect.carriedOverCount > 0 && (
                              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                Carried Over {defect.carriedOverCount}x
                              </span>
                            )}
                          </div>
                          <p className="text-gray-900 dark:text-white font-medium mb-1">
                            {defect.description}
                          </p>
                          {defect.location && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                              Location: {defect.location}
                            </p>
                          )}
                          <p className="text-gray-500 dark:text-gray-500 text-sm">
                            Identified: {new Date(defect.identifiedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Instructions */}
              {uncorrectedDefects.length > 0 && (
                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    What happens next?
                  </h3>
                  <ul className="list-disc list-inside text-blue-800 dark:text-blue-200 space-y-1">
                    <li>These defects will automatically appear in new DVIRs for this vehicle</li>
                    <li>They will continue to carry over until marked as corrected</li>
                    <li>To mark a defect as corrected, use the admin dashboard or maintenance workflow</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Admin Note */}
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              For Administrators
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              To submit new DVIRs or mark defects as corrected, please use the admin dashboard at{' '}
              <a href="/admin" className="text-primary hover:underline font-medium">
                /admin
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
