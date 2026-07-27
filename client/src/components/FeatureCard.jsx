import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  href, 
  stats, 
  className = '',
  onClick 
}) => {
  const CardWrapper = href ? Link : 'div'
  const cardProps = href ? { to: href } : { onClick }

  return (
    <CardWrapper
      {...cardProps}
      className={`group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer hover:-translate-y-1 ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {href && (
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
        )}
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-4 leading-relaxed">
        {description}
      </p>

      {stats && (
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
    </CardWrapper>
  )
}

export default FeatureCard