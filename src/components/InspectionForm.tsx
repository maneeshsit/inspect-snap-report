
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Upload, Trash2, Calendar, User, FileText, CheckCircle, AlertTriangle, Home, Bug, Wind, Droplets, Download, FileDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import jsPDF from 'jspdf';

interface Photo {
  id: string;
  url: string;
  name: string;
}

interface InspectionSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  notes: string;
  photos: Photo[];
  status: 'pending' | 'in-progress' | 'completed';
}

const InspectionForm = () => {
  const [inspectorName, setInspectorName] = useState('');
  const [inspectionDate, setInspectionDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [sections, setSections] = useState<InspectionSection[]>([
    {
      id: 'wind-mitigation',
      title: 'Wind Mitigation',
      icon: <Wind className="h-5 w-5" />,
      description: 'Inspect roof-to-wall connections, roof deck attachment, roof covering, and opening protection',
      notes: '',
      photos: [],
      status: 'pending'
    },
    {
      id: 'wdo',
      title: 'WDO (Termite/Evasive Bugs)',
      icon: <Bug className="h-5 w-5" />,
      description: 'Wood Destroying Organism inspection for termites, carpenter ants, and other pests',
      notes: '',
      photos: [],
      status: 'pending'
    },
    {
      id: 'air-quality',
      title: 'Air Quality (Mold)',
      icon: <Droplets className="h-5 w-5" />,
      description: 'Inspect for mold, moisture issues, and indoor air quality concerns',
      notes: '',
      photos: [],
      status: 'pending'
    },
    {
      id: 'other-areas',
      title: 'Other Key Areas',
      icon: <Home className="h-5 w-5" />,
      description: 'HVAC, Plumbing, Electrical systems and other critical infrastructure',
      notes: '',
      photos: [],
      status: 'pending'
    }
  ]);

  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-yellow-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <AlertTriangle className="h-4 w-4" />;
      default: return null;
    }
  };

  const generateReport = (sectionId: string, sectionTitle: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    toast({
      title: "Report Generated",
      description: `${sectionTitle} report has been generated successfully`,
    });

    console.log(`Generated report for ${sectionTitle}:`, {
      section: section.title,
      notes: section.notes,
      photos: section.photos.length,
      status: section.status
    });
  };

  const downloadReport = (sectionId: string, sectionTitle: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    // Create PDF document
    const doc = new jsPDF();
    
    // Add ISN heading at top center
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.text('Inspection Support Network (ISN)', pageWidth / 2, 20, { align: 'center' });
    
    // Add inspection report title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`${sectionTitle.toUpperCase()} INSPECTION REPORT`, pageWidth / 2, 35, { align: 'center' });
    
    // Add separator line
    doc.setLineWidth(0.5);
    doc.line(20, 45, pageWidth - 20, 45);
    
    // Add report content
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    let yPosition = 60;
    const lineHeight = 7;
    
    // Add inspector details
    doc.setFont('helvetica', 'bold');
    doc.text('Inspector:', 20, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(inspectorName || 'Not specified', 60, yPosition);
    yPosition += lineHeight;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Date:', 20, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(inspectionDate, 60, yPosition);
    yPosition += lineHeight;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Status:', 20, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(section.status.toUpperCase(), 60, yPosition);
    yPosition += lineHeight * 2;
    
    // Add description
    doc.setFont('helvetica', 'bold');
    doc.text('DESCRIPTION:', 20, yPosition);
    yPosition += lineHeight;
    doc.setFont('helvetica', 'normal');
    const descriptionLines = doc.splitTextToSize(section.description, pageWidth - 40);
    doc.text(descriptionLines, 20, yPosition);
    yPosition += descriptionLines.length * lineHeight + lineHeight;
    
    // Add notes
    doc.setFont('helvetica', 'bold');
    doc.text('NOTES:', 20, yPosition);
    yPosition += lineHeight;
    doc.setFont('helvetica', 'normal');
    if (section.notes) {
      const notesLines = doc.splitTextToSize(section.notes, pageWidth - 40);
      doc.text(notesLines, 20, yPosition);
      yPosition += notesLines.length * lineHeight + lineHeight;
    } else {
      doc.text('No notes provided', 20, yPosition);
      yPosition += lineHeight * 2;
    }
    
    // Add photos info
    doc.setFont('helvetica', 'bold');
    doc.text('PHOTOS:', 20, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(`${section.photos.length} photo(s) attached`, 60, yPosition);
    yPosition += lineHeight * 2;
    
    // Add footer
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += lineHeight;
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, yPosition);

    // Save the PDF
    const fileName = `${sectionTitle.replace(/\s+/g, '_')}_Report_${inspectionDate}.pdf`;
    doc.save(fileName);

    toast({
      title: "PDF Report Downloaded",
      description: `${sectionTitle} report has been saved as PDF to your device`,
    });
  };

  const handlePhotoCapture = (sectionId: string, files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photo: Photo = {
          id: Date.now().toString() + Math.random().toString(36),
          url: e.target?.result as string,
          name: file.name
        };

        setSections(prev => prev.map(section => 
          section.id === sectionId 
            ? { 
                ...section, 
                photos: [...section.photos, photo],
                status: section.status === 'pending' ? 'in-progress' : section.status
              }
            : section
        ));
      };
      reader.readAsDataURL(file);
    });

    toast({
      title: "Photos Added",
      description: `${files.length} photo(s) uploaded successfully`,
    });
  };

  const removePhoto = (sectionId: string, photoId: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, photos: section.photos.filter(p => p.id !== photoId) }
        : section
    ));
  };

  const updateNotes = (sectionId: string, notes: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            notes,
            status: notes.trim() ? (section.photos.length > 0 ? 'completed' : 'in-progress') : 
                    (section.photos.length > 0 ? 'in-progress' : 'pending')
          }
        : section
    ));
  };

  const handleSubmit = () => {
    if (!inspectorName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter the inspector name",
        variant: "destructive"
      });
      return;
    }

    const completedSections = sections.filter(s => s.status === 'completed').length;
    const totalSections = sections.length;

    toast({
      title: "Inspection Submitted",
      description: `Inspection form submitted successfully. ${completedSections}/${totalSections} sections completed.`,
    });

    console.log('Inspection Data:', {
      inspectorName,
      inspectionDate,
      selectedTemplate,
      sections
    });
  };

  const loadTemplate = (template: string) => {
    const templates = {
      'wind-mitigation': {
        notes: 'Inspect roof-to-wall connections, gable end bracing, roof deck attachment, roof covering materials, and opening protection systems.',
        focus: ['wind-mitigation']
      },
      'wdo': {
        notes: 'Comprehensive wood destroying organism inspection focusing on subterranean termites, drywood termites, carpenter ants, and wood boring beetles.',
        focus: ['wdo']
      },
      'air-quality': {
        notes: 'Indoor air quality assessment including mold inspection, moisture detection, and ventilation system evaluation.',
        focus: ['air-quality']
      }
    };

    const templateData = templates[template as keyof typeof templates];
    if (templateData) {
      setSections(prev => prev.map(section => 
        templateData.focus.includes(section.id)
          ? { ...section, notes: templateData.notes, status: 'in-progress' as const }
          : section
      ));
      
      toast({
        title: "Template Loaded",
        description: `${template.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} template applied`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              4-Point Inspection Form
            </CardTitle>
            <p className="text-gray-600 mt-2">Professional Property Inspection Documentation</p>
          </CardHeader>
        </Card>

        {/* Inspector Information */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="h-5 w-5 text-blue-600" />
              Inspector Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="inspector-name" className="text-sm font-medium">Inspector Name</Label>
                <Input
                  id="inspector-name"
                  value={inspectorName}
                  onChange={(e) => setInspectorName(e.target.value)}
                  placeholder="Enter inspector name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="inspection-date" className="text-sm font-medium">Inspection Date</Label>
                <Input
                  id="inspection-date"
                  type="date"
                  value={inspectionDate}
                  onChange={(e) => setInspectionDate(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            
          </CardContent>
        </Card>

        {/* Inspection Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <Card key={section.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      {section.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{section.title}</h3>
                      <p className="text-sm text-gray-600 font-normal">{section.description}</p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(section.status)} text-white flex items-center gap-1`}>
                    {getStatusIcon(section.status)}
                    {section.status.replace('-', ' ')}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Notes Section */}
                <div>
                  <Label className="text-sm font-medium">Inspection Notes</Label>
                  <Textarea
                    value={section.notes}
                    onChange={(e) => updateNotes(section.id, e.target.value)}
                    placeholder={`Enter ${section.title.toLowerCase()} inspection notes...`}
                    className="mt-1 min-h-[100px]"
                  />
                </div>

                {/* Photo Section */}
                <div>
                  <Label className="text-sm font-medium">Photos & Reports</Label>
                  <div className="mt-2 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRefs.current[section.id]?.click()}
                        className="flex items-center gap-2"
                      >
                        <Camera className="h-4 w-4" />
                        Take Photo
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRefs.current[`${section.id}-upload`]?.click()}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Upload
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => generateReport(section.id, section.title)}
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        Generate Report
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            <Download className="h-4 w-4" />
                            Download Report
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Download {section.title} Report</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will download the inspection report for {section.title} as a text file to your device. 
                              The report includes inspector details, notes, and photo count.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => downloadReport(section.id, section.title)}>
                              Download
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    {/* Hidden file inputs */}
                    <input
                      ref={(el) => fileInputRefs.current[section.id] = el}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      multiple
                      onChange={(e) => handlePhotoCapture(section.id, e.target.files)}
                      className="hidden"
                    />
                    <input
                      ref={(el) => fileInputRefs.current[`${section.id}-upload`] = el}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handlePhotoCapture(section.id, e.target.files)}
                      className="hidden"
                    />

                    {/* Photo Gallery */}
                    {section.photos.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {section.photos.map((photo) => (
                          <div key={photo.id} className="relative group">
                            <img
                              src={photo.url}
                              alt={photo.name}
                              className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                            />
                            <Button
                              size="sm"
                              variant="destructive"
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
                              onClick={() => removePhoto(section.id, photo.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Submit Button */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="pt-6">
            <Button 
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 text-lg font-semibold shadow-lg"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Submit Inspection
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InspectionForm;
