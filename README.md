# Image Classification System Using Deep Learning

A professional, production-ready MCA First Year Project demonstrating advanced computer vision capabilities using deep learning technologies.

## Project Overview

This application implements a real-time image classification system powered by TensorFlow.js and the MobileNet deep learning model. Users can upload images and receive instant predictions with confidence scores, all running directly in the browser.

## Key Features

### Core Functionality

- **Real-time Image Classification**: Upload images and get instant predictions using the MobileNet deep learning model
- **Multi-class Predictions**: Display top predictions with confidence percentages
- **Classification History**: Track and manage all previous classifications
- **User Authentication**: Secure sign-up and login system using Supabase Auth
- **Data Persistence**: All classifications are saved to a Supabase PostgreSQL database

### Technical Features

- **Deep Learning**: TensorFlow.js with pre-trained MobileNet model
- **Browser-based ML**: No server-side processing required for classification
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Professional interface with smooth animations and transitions
- **Type Safety**: Full TypeScript implementation
- **Secure Backend**: Row Level Security (RLS) policies for data protection

## Technology Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for modern styling
- **Lucide React** for icons

### Deep Learning

- **TensorFlow.js** - Machine learning in the browser
- **MobileNet** - Pre-trained image classification model
- Supports 1000+ object categories from ImageNet dataset

### Backend & Database

- **Supabase** - PostgreSQL database with real-time capabilities
- **Supabase Auth** - Email/password authentication
- **Row Level Security** - User-scoped data access

## Project Structure

```
src/
├── components/
│   ├── Auth.tsx          # Authentication UI (login/signup)
│   ├── Classifier.tsx    # Main image classification interface
│   ├── Dashboard.tsx     # Main app dashboard with navigation
│   └── History.tsx       # Classification history view
├── contexts/
│   └── AuthContext.tsx   # Authentication state management
├── lib/
│   └── supabase.ts       # Supabase client configuration
├── services/
│   └── classifier.ts     # TensorFlow.js classification logic
├── App.tsx               # Root component
└── main.tsx              # Application entry point
```

## Database Schema

### classifications Table

- `id` (uuid) - Primary key
- `user_id` (uuid) - Foreign key to auth.users
- `image_url` (text) - Image data URI
- `predictions` (jsonb) - Array of prediction objects
- `top_prediction` (text) - Highest confidence prediction
- `confidence` (numeric) - Confidence score (0-100)
- `created_at` (timestamptz) - Timestamp

### Security

- Row Level Security (RLS) enabled
- Users can only access their own classifications
- Authenticated users only

## How It Works

1. **User Authentication**: Users sign up or sign in to access the application
2. **Image Upload**: Users can drag-and-drop or click to upload an image
3. **Deep Learning Classification**:
   - TensorFlow.js loads the MobileNet model (cached after first load)
   - Image is processed through the neural network
   - Model outputs top predictions with confidence scores
4. **Results Display**: Shows predictions with visual confidence bars
5. **Data Storage**: Classification results are saved to Supabase database
6. **History Tracking**: Users can view all past classifications with timestamps

## Model Information

### MobileNet

- **Architecture**: Efficient convolutional neural network
- **Training Dataset**: ImageNet (1.2M images, 1000 categories)
- **Categories**: Animals, objects, vehicles, food, and more
- **Accuracy**: High accuracy for common objects
- **Performance**: Optimized for real-time browser inference

## Usage Instructions

1. **Create an Account**
   - Enter your email and password
   - Click "Create Account"

2. **Sign In**
   - Use your credentials to sign in

3. **Classify Images**
   - Click "Classify" tab
   - Upload an image (JPG, PNG, GIF)
   - Click "Classify Image" button
   - View predictions with confidence scores

4. **View History**
   - Click "History" tab
   - See all your previous classifications
   - Delete unwanted entries

## Project Highlights

This project demonstrates:

- Advanced understanding of deep learning concepts
- Integration of modern ML frameworks in web applications
- Full-stack development capabilities
- Database design and security best practices
- Professional UI/UX design
- Production-ready code quality
- Real-world application of computer vision

## Future Enhancements

Potential improvements for further development:

- Custom model training for specific domains
- Batch image processing
- Export classification reports
- Advanced filtering and search in history
- Image preprocessing options
- Confidence threshold settings
- Social sharing of results

## Academic Context

**Course**: Master of Computer Applications (MCA)
**Project Type**: First Year Project
**Domain**: Artificial Intelligence & Deep Learning
**Focus Areas**: Computer Vision, Web Development, Database Management

---

**Note**: This is a fully functional, production-ready application suitable for demonstration and deployment.
