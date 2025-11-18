/**
 * PDF Generator for Driver Application
 * Generates a PDF preview of the complete application
 */

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { DriverApplicationData } from '@/lib/supabase/driver-application'

// Type for jsPDF with autoTable plugin
interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number
  }
}

export function generateApplicationPDF(data: Partial<DriverApplicationData>): jsPDF {
  const doc = new jsPDF()
  let yPosition = 20

  // Title
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('Driver Employment Application', 105, yPosition, { align: 'center' })

  yPosition += 10
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Lake Ride Pros - 49 CFR 391.21 Compliant', 105, yPosition, { align: 'center' })

  yPosition += 15

  // Personal Information
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Personal Information', 14, yPosition)
  yPosition += 8

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')

  const personalInfo = [
    ['Name', `${data.first_name || ''} ${data.middle_name || ''} ${data.last_name || ''}`],
    ['Date of Birth', data.date_of_birth || 'N/A'],
    ['Email', data.email || 'N/A'],
    ['Phone', data.phone || 'N/A'],
    ['Address', `${data.address_street || ''}, ${data.address_city || ''}, ${data.address_state || ''} ${data.address_zip || ''}`],
    ['Legal Right to Work', data.has_legal_right_to_work ? 'Yes' : 'No']
  ]

  autoTable(doc, {
    startY: yPosition,
    head: [],
    body: personalInfo,
    theme: 'grid',
    styles: { fontSize: 9 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } }
  })

  yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 10

  // Residence History
  if (data.residences && data.residences.length > 0) {
    if (yPosition > 250) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Residence History (Past 3 Years)', 14, yPosition)
    yPosition += 8

    const residenceData = data.residences.map((res, idx) => [
      `${idx + 1}`,
      `${res.street}, ${res.city}, ${res.state} ${res.zip}`,
      `${res.from_date} to ${res.to_date || 'Present'}`,
      res.is_current ? 'Yes' : 'No'
    ])

    autoTable(doc, {
      startY: yPosition,
      head: [['#', 'Address', 'Period', 'Current']],
      body: residenceData,
      theme: 'striped',
      styles: { fontSize: 8 }
    })

    yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 10
  }

  // Current License
  if (yPosition > 250) {
    doc.addPage()
    yPosition = 20
  }

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Current Driver License', 14, yPosition)
  yPosition += 8

  const licenseInfo = [
    ['License Number', data.current_license_number || 'N/A'],
    ['State', data.current_license_state || 'N/A'],
    ['Class', data.current_license_class || 'N/A'],
    ['Expiration', data.current_license_expiration || 'N/A'],
    ['Revoked (Past 3 Years)', data.license_revoked_past_3_years ? 'Yes' : 'No']
  ]

  autoTable(doc, {
    startY: yPosition,
    head: [],
    body: licenseInfo,
    theme: 'grid',
    styles: { fontSize: 9 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 } }
  })

  yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 10

  // License History
  if (data.licenses && data.licenses.length > 0) {
    if (yPosition > 250) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('All Licenses (Past 3 Years)', 14, yPosition)
    yPosition += 8

    const licenseData = data.licenses.map((lic, idx) => [
      `${idx + 1}`,
      lic.state,
      lic.number,
      lic.type_class,
      lic.endorsements || 'None',
      lic.is_current ? 'Yes' : 'No'
    ])

    autoTable(doc, {
      startY: yPosition,
      head: [['#', 'State', 'Number', 'Class', 'Endorsements', 'Current']],
      body: licenseData,
      theme: 'striped',
      styles: { fontSize: 8 }
    })

    yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 10
  }

  // Driving Experience
  if (data.driving_experience && data.driving_experience.length > 0) {
    if (yPosition > 240) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Driving Experience', 14, yPosition)
    yPosition += 8

    const expData = data.driving_experience.map((exp, idx) => [
      `${idx + 1}`,
      exp.class_of_equipment,
      exp.type,
      `${exp.date_from} to ${exp.date_to || 'Present'}`,
      exp.miles ? `${exp.miles.toLocaleString()} mi` : 'N/A'
    ])

    autoTable(doc, {
      startY: yPosition,
      head: [['#', 'Equipment Class', 'Type', 'Period', 'Miles']],
      body: expData,
      theme: 'striped',
      styles: { fontSize: 8 }
    })

    yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 10
  }

  // Accidents
  if (data.accidents && data.accidents.length > 0) {
    if (yPosition > 230) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Accidents (Past 3 Years)', 14, yPosition)
    yPosition += 8

    const accidentData = data.accidents.map((acc) => [
      acc.date,
      acc.nature.substring(0, 80),
      acc.fatalities.toString(),
      acc.injuries.toString(),
      acc.chemical_spills ? 'Yes' : 'No'
    ])

    autoTable(doc, {
      startY: yPosition,
      head: [['Date', 'Nature', 'Fatalities', 'Injuries', 'Hazmat Spill']],
      body: accidentData,
      theme: 'striped',
      styles: { fontSize: 8 }
    })

    yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 10
  }

  // Traffic Convictions
  if (data.traffic_convictions && data.traffic_convictions.length > 0) {
    if (yPosition > 230) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Traffic Convictions (Past 3 Years)', 14, yPosition)
    yPosition += 8

    const convictionData = data.traffic_convictions.map((conv) => [
      conv.date,
      conv.state,
      conv.violation.substring(0, 60),
      conv.penalty.substring(0, 60)
    ])

    autoTable(doc, {
      startY: yPosition,
      head: [['Date', 'State', 'Violation', 'Penalty']],
      body: convictionData,
      theme: 'striped',
      styles: { fontSize: 8 }
    })

    yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 10
  }

  // Employment History
  if (data.employment_history && data.employment_history.length > 0) {
    doc.addPage()
    yPosition = 20

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Employment History', 14, yPosition)
    yPosition += 8

    const empData = data.employment_history.map((emp, idx) => [
      `${idx + 1}`,
      emp.name.substring(0, 40),
      emp.position.substring(0, 30),
      `${emp.from_date} to ${emp.to_date || 'Present'}`,
      emp.subject_to_fmcsr ? 'Yes' : 'No'
    ])

    autoTable(doc, {
      startY: yPosition,
      head: [['#', 'Employer', 'Position', 'Period', 'CMV Driver']],
      body: empData,
      theme: 'striped',
      styles: { fontSize: 8 }
    })

    yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 10
  }

  // Education
  if (data.education && data.education.length > 0) {
    if (yPosition > 230) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Education', 14, yPosition)
    yPosition += 8

    const eduData = data.education.map((edu) => [
      edu.school_name.substring(0, 50),
      edu.location,
      edu.course_of_study || 'N/A',
      edu.graduated ? 'Yes' : 'No'
    ])

    autoTable(doc, {
      startY: yPosition,
      head: [['School', 'Location', 'Course of Study', 'Graduated']],
      body: eduData,
      theme: 'striped',
      styles: { fontSize: 8 }
    })

    yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 10
  }

  // Certification
  doc.addPage()
  yPosition = 20

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Certification', 14, yPosition)
  yPosition += 10

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  const certText = `I certify that this application was completed by me, and that all entries on it and information in it are true and complete to the best of my knowledge.`
  const splitCertText = doc.splitTextToSize(certText, 180)
  doc.text(splitCertText, 14, yPosition)

  yPosition += splitCertText.length * 5 + 10

  if (data.certification_signature_date) {
    doc.text(`Signed on: ${new Date(data.certification_signature_date).toLocaleDateString()}`, 14, yPosition)
  }

  // Footer on last page
  doc.setFontSize(8)
  doc.setTextColor(100)
  doc.text('This application complies with 49 CFR 391.21 federal regulations.', 105, 285, { align: 'center' })

  return doc
}

export function downloadApplicationPDF(data: Partial<DriverApplicationData>, filename: string = 'driver-application.pdf') {
  const doc = generateApplicationPDF(data)
  doc.save(filename)
}

export function previewApplicationPDF(data: Partial<DriverApplicationData>): string {
  const doc = generateApplicationPDF(data)
  return doc.output('dataurlstring')
}
