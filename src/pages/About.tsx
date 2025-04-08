import React from 'react';
import { Leaf, Shield, CheckCircle, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <Leaf className="h-16 w-16 text-green-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            About GreenSign
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Leading the way in secure and eco-friendly digital signatures
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="flex justify-center">
                <Shield className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900">Security First</h3>
              <p className="mt-2 text-gray-500">
                Advanced encryption and secure storage for all your documents and signatures
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900">Legal Compliance</h3>
              <p className="mt-2 text-gray-500">
                Signatures that meet international legal standards and requirements
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center">
                <Users className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900">Global Trust</h3>
              <p className="mt-2 text-gray-500">
                Trusted by organizations worldwide for secure document signing
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="px-6 py-12 sm:px-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Our Mission</h3>
            <div className="prose prose-lg text-gray-600">
              <p className="mb-4">
                At GreenSign, we're committed to revolutionizing document signing by making it secure, 
                efficient, and environmentally conscious. Our platform combines cutting-edge technology 
                with user-friendly design to provide a seamless digital signature experience.
              </p>
              <p className="mb-4">
                We believe in a paperless future where document signing is not only secure and legally 
                binding but also contributes to environmental sustainability. By choosing digital 
                signatures, our users help reduce paper waste and carbon footprint.
              </p>
              <p>
                Our team of experts works tirelessly to ensure that every signature made through 
                GreenSign is secure, verifiable, and compliant with international standards.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center">
          <p className="text-gray-500">
            Developed by Yassin BRAHIM
          </p>
        </div>
      </div>
    </div>
  );
}