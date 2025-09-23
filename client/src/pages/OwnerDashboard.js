import { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'

const OwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('properties')
  const [properties, setProperties] = useState([])
  const [bookings, setBookings] = useState([])
  const [owners, setOwners] = useState([])
  const [selectedOwner, setSelectedOwner] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showPropertyForm, setShowPropertyForm] = useState(false)
  const [showOwnerForm, setShowOwnerForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [propertiesRes, bookingsRes, ownersRes] = await Promise.all([
        axios.get('/api/properties'),
        axios.get('/api/bookings'),
        axios.get('/api/owners')
      ])
      
      setProperties(propertiesRes.data)
      setBookings(bookingsRes.data)
      setOwners(ownersRes.data)
      
      if (ownersRes.data.length > 0 && !selectedOwner) {
        setSelectedOwner(ownersRes.data[0])
      }
    } catch (error) {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const ownerValidationSchema = Yup.object({
    name: Yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    phone: Yup.string().matches(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number format')
  })

  const propertyValidationSchema = Yup.object({
    name: Yup.string().required('Property name is required'),
    description: Yup.string().required('Description is required'),
    location: Yup.string().required('Location is required'),
    price_per_night: Yup.number().required('Price is required').min(1, 'Price must be greater than 0'),
    max_guests: Yup.number().required('Max guests is required').min(1, 'Must accommodate at least 1 guest'),
    amenities: Yup.string(),
    image_url: Yup.string().url('Must be a valid URL')
  })

  const handleOwnerSubmit = async (values, { resetForm }) => {
    try {
      const response = await axios.post('/api/owners', values)
      setOwners([...owners, response.data])
      setSelectedOwner(response.data)
      setShowOwnerForm(false)
      resetForm()
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create owner')
    }
  }

  const handlePropertySubmit = async (values, { resetForm }) => {
    if (!selectedOwner) {
      setError('Please select or create an owner first')
      return
    }

    try {
      const propertyData = { ...values, owner_id: selectedOwner.id }
      
      if (editingProperty) {
        const response = await axios.put(`/api/properties/${editingProperty.id}`, propertyData)
        setProperties(properties.map(p => p.id === editingProperty.id ? response.data : p))
        setEditingProperty(null)
      } else {
        const response = await axios.post('/api/properties', propertyData)
        setProperties([...properties, response.data])
      }
      
      setShowPropertyForm(false)
      resetForm()
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to save property')
    }
  }

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await axios.delete(`/api/properties/${propertyId}`)
        setProperties(properties.filter(p => p.id !== propertyId))
      } catch (error) {
        setError('Failed to delete property')
      }
    }
  }

  const getOwnerProperties = () => {
    return selectedOwner ? properties.filter(p => p.owner_id === selectedOwner.id) : []
  }

  const getOwnerBookings = () => {
    const ownerPropertyIds = getOwnerProperties().map(p => p.id)
    return bookings.filter(b => ownerPropertyIds.includes(b.property_id))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your properties and bookings</p>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Owner Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Select Owner</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {owners.map(owner => (
              <button
                key={owner.id}
                onClick={() => setSelectedOwner(owner)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  selectedOwner?.id === owner.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                👥 {owner.name}
              </button>
            ))}
            <button
              onClick={() => setShowOwnerForm(true)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            >
              ➕ Add Owner
            </button>
          </div>
          
          {selectedOwner && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900">{selectedOwner.name}</h3>
              <p className="text-blue-700">{selectedOwner.email}</p>
              {selectedOwner.phone && <p className="text-blue-700">{selectedOwner.phone}</p>}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('properties')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'properties'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            🏢 Properties
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'bookings'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            📅 Bookings
          </button>
        </div>

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Properties</h2>
              <button
                onClick={() => {
                  setEditingProperty(null)
                  setShowPropertyForm(true)
                }}
                disabled={!selectedOwner}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  !selectedOwner
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                ➕ Add Property
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getOwnerProperties().map(property => (
                <div key={property.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="p-4">
                    <img
                      src={property.image_url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=200&fit=crop'}
                      alt={property.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=200&fit=crop'
                      }}
                    />
                    <h3 className="font-semibold text-lg mb-2">{property.name}</h3>
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <span className="mr-2">📍</span>
                        <span>{property.location}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">💰</span>
                        <span>${property.price_per_night}/night</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">👥</span>
                        <span>Up to {property.max_guests} guests</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingProperty(property)
                          setShowPropertyForm(true)
                        }}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteProperty(property.id)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {getOwnerProperties().length === 0 && (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🏢</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties yet</h3>
                <p className="text-gray-600">Add your first property to get started.</p>
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Bookings</h2>
            
            <div className="space-y-4">
              {getOwnerBookings().map(booking => {
                const property = properties.find(p => p.id === booking.property_id)
                return (
                  <div key={booking.id} className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">{property?.name}</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p><strong>Guest:</strong> {booking.guest_name}</p>
                          <p><strong>Email:</strong> {booking.guest_email}</p>
                          <p><strong>Check-in:</strong> {booking.check_in_date}</p>
                          <p><strong>Check-out:</strong> {booking.check_out_date}</p>
                          <p><strong>Total:</strong> ${booking.total_price}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        booking.booking_status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.booking_status}
                      </span>
                    </div>
                  </div>
                )
              })}
              
              {getOwnerBookings().length === 0 && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">📅</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
                  <p className="text-gray-600">Bookings will appear here once guests make reservations.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Owner Form Modal */}
        {showOwnerForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
              <h3 className="text-xl font-semibold mb-4">Add New Owner</h3>
              <Formik
                initialValues={{ name: '', email: '', phone: '' }}
                validationSchema={ownerValidationSchema}
                onSubmit={handleOwnerSubmit}
              >
                {({ errors, touched }) => (
                  <Form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <Field
                        id="name"
                        name="name"
                        className={`w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.name && touched.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <ErrorMessage name="name" component="div" className="text-sm text-red-500 mt-1" />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        className={`w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.email && touched.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <ErrorMessage name="email" component="div" className="text-sm text-red-500 mt-1" />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
                      <Field
                        id="phone"
                        name="phone"
                        className={`w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.phone && touched.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <ErrorMessage name="phone" component="div" className="text-sm text-red-500 mt-1" />
                    </div>

                    <div className="flex space-x-2">
                      <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                        Create Owner
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowOwnerForm(false)}
                        className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        )}

        {/* Property Form Modal */}
        {showPropertyForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
              <h3 className="text-xl font-semibold mb-4">
                {editingProperty ? 'Edit Property' : 'Add New Property'}
              </h3>
              <Formik
                initialValues={{
                  name: editingProperty?.name || '',
                  description: editingProperty?.description || '',
                  location: editingProperty?.location || '',
                  price_per_night: editingProperty?.price_per_night || '',
                  max_guests: editingProperty?.max_guests || '',
                  amenities: editingProperty?.amenities || '',
                  image_url: editingProperty?.image_url || ''
                }}
                validationSchema={propertyValidationSchema}
                onSubmit={handlePropertySubmit}
              >
                {({ errors, touched }) => (
                  <Form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
                      <Field
                        id="name"
                        name="name"
                        className={`w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.name && touched.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <ErrorMessage name="name" component="div" className="text-sm text-red-500 mt-1" />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <Field
                        as="textarea"
                        id="description"
                        name="description"
                        rows={3}
                        className={`w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.description && touched.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <ErrorMessage name="description" component="div" className="text-sm text-red-500 mt-1" />
                    </div>

                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <Field
                        id="location"
                        name="location"
                        className={`w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.location && touched.location ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <ErrorMessage name="location" component="div" className="text-sm text-red-500 mt-1" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="price_per_night" className="block text-sm font-medium text-gray-700 mb-1">Price per Night ($)</label>
                        <Field
                          id="price_per_night"
                          name="price_per_night"
                          type="number"
                          min="1"
                          step="0.01"
                          className={`w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.price_per_night && touched.price_per_night ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        <ErrorMessage name="price_per_night" component="div" className="text-sm text-red-500 mt-1" />
                      </div>

                      <div>
                        <label htmlFor="max_guests" className="block text-sm font-medium text-gray-700 mb-1">Max Guests</label>
                        <Field
                          id="max_guests"
                          name="max_guests"
                          type="number"
                          min="1"
                          className={`w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.max_guests && touched.max_guests ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        <ErrorMessage name="max_guests" component="div" className="text-sm text-red-500 mt-1" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="amenities" className="block text-sm font-medium text-gray-700 mb-1">Amenities (comma-separated)</label>
                      <Field
                        id="amenities"
                        name="amenities"
                        placeholder="WiFi, Pool, Kitchen, Parking"
                        className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
                      <Field
                        id="image_url"
                        name="image_url"
                        placeholder="https://example.com/image.jpg"
                        className={`w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.image_url && touched.image_url ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <ErrorMessage name="image_url" component="div" className="text-sm text-red-500 mt-1" />
                    </div>

                    <div className="flex space-x-2">
                      <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                        {editingProperty ? 'Update Property' : 'Create Property'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPropertyForm(false)
                          setEditingProperty(null)
                        }}
                        className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OwnerDashboard