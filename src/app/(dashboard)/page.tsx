import React from 'react'
import DashboardOverview from './_components/DashboardOverview'
import Blogandproject from './_components/Blogandproject'
import CTSSection from './_components/CTSSection'

function page() {
  return (
    <div>
      <DashboardOverview />
      <Blogandproject />
      <CTSSection />
    </div>
  )
}

export default page