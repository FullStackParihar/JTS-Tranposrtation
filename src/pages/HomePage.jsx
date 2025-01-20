import React from 'react'
import '../pages/mainbg.css'
const HomePage = () => {
    return (
        <div>
            <div id='mainbg' className='relative bg-gray-100 h-96'>
                <div className=' max-w-8xl mx-auto text-start p-8 '>
                    <h1 className='text-5xl font-extrabold text-gray-900 hover:text-6xl duration-150'>
                        Reliable Bulk Milk Transpotation
                    </h1>
                    <p className='mt-4 text-lg font-semibold text-white'>
                        Delivering fresh milk products safely across cities with our cold-chain logistics
                    </p>
                    <a className='mt-6 inline-block bg-blue-500 text-white px-8 py-2 hover:bg-blue-700 ' href="">Get service</a>
                </div>
            </div>
            <div id="service" className='py-16 bg-white '>
                <div className='max-w-7xl mx-auto text-center'>
                    <h2 className='text-4xl font-bold text-gray-900'>Our Services</h2>
                    <p className='text-lg text-gary-700 mt-2 '>We provide a rang of milk transportation solutions.</p>
                </div>
                <div className='mt-8 gride md:grid-cols-3 gap-8'>
                    <div className='p-6 border rounded-lg shadow-md'>
                        <h3 className='text-xl font-semibold text-blue-600 '>16ft & 19ft Trucks</h3>
                        <p className='text-gray-600 mt-2 '>for larger scale milk product transportation with temperature contraol</p>
                    </div>
                    <div className='p-6 border rounded-lg shadow-md'>
                        <h3 className='text-xl font-semibold text-blue-600 '>Pickup Trucks</h3>
                        <p className='text-gray-600'>Perfect for smaller bulk deliveries and quick transport.</p>
                    </div>
                    <div className='p-6 border rounded-lg shadow-md'>
                        <h3 className='text-xl font-semibold text-blue-600'>Cold Chain Logistics</h3>
                        <p className='text-gray-600 mt-'>Ensuring the freshness of milk products during transit</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage
