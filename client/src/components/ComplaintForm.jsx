import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle } from 'lucide-react';

import FormField from './FormField';
import FileUpload from './FileUpload';
import ProgressBar from './ProgressBar';
import AIChat from './AIChat';
import ReviewScreen from './ReviewScreen';

import { validateAadhaar, validateMobile, validateEmail, validateDate, validateDescription } from '../utils/validators';

const initialForm = {
  fullName: '',
  aadhaarNumber: '',
  mobileNumber: '',
  email: '',
  address: '',
  district: '',
  state: '',
  complaintType: '',
  incidentDate: '',
  incidentTime: '',
  incidentLocation: '',
  description: '',
  suspectDetails: '',
  witnessInfo: ''
};

const ComplaintForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [files, setFiles] = useState([]);
  const [showReview, setShowReview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('complaintDraft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.form) setFormData(parsed.form);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      localStorage.setItem('complaintDraft', JSON.stringify({ form: formData }));
    }, 30000);
    return () => clearInterval(timer);
  }, [formData]);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'aadhaarNumber':
        if (value && !validateAadhaar(value)) error = 'Invalid Aadhaar format';
        break;
      case 'mobileNumber':
        if (value && !validateMobile(value)) error = 'Invalid 10-digit mobile number';
        break;
      case 'email':
        if (value && !validateEmail(value)) error = 'Invalid email address';
        break;
      case 'incidentDate':
        if (value && !validateDate(value)) error = 'Date cannot be in the future';
        break;
      case 'description':
        if (value && !validateDescription(value)) error = 'Description must be at least 50 characters';
        break;
      case 'fullName':
      case 'address':
      case 'district':
      case 'state':
      case 'complaintType':
      case 'incidentTime':
      case 'incidentLocation':
        if (!value.trim()) error = 'This field is required';
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleAIFormUpdate = (extractedData) => {
    setFormData(prev => {
      const updated = { ...prev };
      for (const [key, value] of Object.entries(extractedData)) {
        if (value && typeof value === 'string' && value.trim() && Object.hasOwn(initialForm, key)) {
          updated[key] = value;
        }
      }
      return updated;
    });

    setErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(extractedData).forEach(key => {
        if (Object.hasOwn(initialForm, key) && extractedData[key]) {
          newErrors[key] = validateField(key, extractedData[key]);
        }
      });
      return newErrors;
    });
  };

  const calculateProgress = useMemo(() => {
    const requiredFields = [
      'fullName', 'aadhaarNumber', 'mobileNumber', 'address', 'district', 'state',
      'complaintType', 'incidentDate', 'incidentTime', 'incidentLocation', 'description'
    ];
    let completed = 0;
    requiredFields.forEach(field => {
      if (formData[field] && !errors[field] && formData[field].length > 0) {
        if (field === 'description' && formData[field].length < 50) return;
        completed++;
      }
    });
    return (completed / requiredFields.length) * 100;
  }, [formData, errors]);

  const handleReviewClick = () => {
    const newErrors = {};
    let hasError = false;
    Object.keys(formData).forEach(key => {
      const err = validateField(key, formData[key]);
      if (err && !['suspectDetails', 'witnessInfo', 'email'].includes(key) && !formData[key]) {
         newErrors[key] = err || 'Required';
         hasError = true;
      }
    });

    if (hasError) {
      setErrors(prev => ({ ...prev, ...newErrors }));
      alert("Please fill in all required fields correctly before reviewing.");
      return;
    }

    setShowReview(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (data.success) {
        localStorage.removeItem('complaintDraft');
        navigate(`/success/${data.referenceNumber}`, { state: { formData } });
      } else {
        alert("Failed to submit complaint.");
      }
    } catch (e) {
      alert("Server connection error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showReview) {
    return <ReviewScreen formData={formData} onBack={() => setShowReview(false)} onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-6 mt-4 pb-12">
      {/* LEFT COLUMN: FORM */}
      <div className="w-full lg:w-[65%] glass-panel flex flex-col relative order-2 lg:order-1">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100">{t('file_complaint')}</h2>
        </div>

        <ProgressBar percentage={calculateProgress} />

        <div className="space-y-6 mt-6">
          <div className="form-section">
            <h3 className="text-lg font-semibold mb-4 text-amber-600 dark:text-amber-400 flex items-center gap-2">
              <CheckCircle size={18} /> Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label={t('your_name')} name="fullName" value={formData.fullName} onChange={handleChange} error={errors.fullName} isValid={!!formData.fullName && !errors.fullName} required />
              <FormField label={t('aadhaar_number')} name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} error={errors.aadhaarNumber} isValid={!!formData.aadhaarNumber && !errors.aadhaarNumber} placeholder="12-digit number" required />
              
              <div className="col-span-1 md:col-span-2">
                <FormField label={t('mobile_number')} name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} error={errors.mobileNumber} isValid={validateMobile(formData.mobileNumber)} required />
              </div>
              
              <FormField label={t('email_address')} name="email" value={formData.email} onChange={handleChange} error={errors.email} isValid={!!formData.email && !errors.email} />
              
              <div className="col-span-1 md:col-span-2">
                <FormField label={t('address')} name="address" as="textarea" rows={2} value={formData.address} onChange={handleChange} error={errors.address} isValid={!!formData.address && !errors.address} required />
              </div>
              
              <FormField label={t('state')} name="state" value={formData.state} onChange={handleChange} error={errors.state} isValid={!!formData.state && !errors.state} required />
              <FormField label={t('district')} name="district" value={formData.district} onChange={handleChange} error={errors.district} isValid={!!formData.district && !errors.district} required />
            </div>
          </div>

          <div className="form-section">
            <h3 className="text-lg font-semibold mb-4 text-amber-600 dark:text-amber-400 flex items-center gap-2">
              <AlertTriangle size={18} /> Complaint Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1 md:col-span-2">
                <FormField 
                  label={t('complaint_type')} 
                  name="complaintType" 
                  as="select" 
                  options={[
                    {value: 'Theft', label: t('type_theft')},
                    {value: 'Assault', label: t('type_assault')},
                    {value: 'Cyber Crime', label: t('type_cyber')},
                    {value: 'Missing Person', label: t('type_missing_person')},
                    {value: 'Domestic Violence', label: t('type_domestic_violence')},
                    {value: 'Fraud', label: t('type_fraud')},
                    {value: 'Other', label: t('type_other')}
                  ]}
                  value={formData.complaintType} 
                  onChange={handleChange} 
                  error={errors.complaintType} 
                  isValid={!!formData.complaintType && !errors.complaintType} 
                  required 
                />
              </div>

              <FormField type="date" label={t('incident_date')} name="incidentDate" value={formData.incidentDate} onChange={handleChange} error={errors.incidentDate} isValid={!!formData.incidentDate && !errors.incidentDate} required />
              <FormField type="time" label={t('incident_time')} name="incidentTime" value={formData.incidentTime} onChange={handleChange} error={errors.incidentTime} isValid={!!formData.incidentTime && !errors.incidentTime} required />
              
              <div className="col-span-1 md:col-span-2">
                <FormField label={t('incident_location')} name="incidentLocation" value={formData.incidentLocation} onChange={handleChange} error={errors.incidentLocation} isValid={!!formData.incidentLocation && !errors.incidentLocation} required />
              </div>

              <div className="col-span-1 md:col-span-2">
                <FormField 
                  label={t('description')} 
                  name="description" 
                  as="textarea" 
                  rows={4} 
                  placeholder="Minimum 50 characters requested..."
                  value={formData.description} 
                  onChange={handleChange} 
                  error={errors.description} 
                  isValid={formData.description.length >= 50} 
                  required 
                />
                <div className="text-right text-xs mt-1 text-slate-500">
                  {formData.description.length} / 50 characters
                </div>
              </div>

              <div className="col-span-1 md:col-span-2">
                <FormField label={t('suspect_details')} name="suspectDetails" as="textarea" rows={2} value={formData.suspectDetails} onChange={handleChange} />
              </div>

              <div className="col-span-1 md:col-span-2">
                <FormField label={t('witness_info')} name="witnessInfo" as="textarea" rows={2} value={formData.witnessInfo} onChange={handleChange} />
              </div>
            </div>

            <div className="mt-6">
              <FileUpload onFilesSelect={setFiles} />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 sticky bottom-4 z-10 shadow-xl">
            <button
              type="button"
              onClick={handleReviewClick}
              className="btn-primary w-full md:w-auto px-10"
            >
              Review Information
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: AI CHAT */}
      <div className="w-full lg:w-[35%] h-[500px] lg:h-[calc(100vh-[120px])] lg:sticky top-20 order-1 lg:order-2 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <AIChat onFormUpdate={handleAIFormUpdate} />
      </div>
    </div>
  );
};

export default ComplaintForm;
