import React from 'react'
import '../pages/mainbg.css'

const HomePage = () => {
    return (
        <div>
            <div id='mainbg' className='relative bg-gradient-to-r from-[#FF6B6B] to-[#FFA07A] h-96'>
                <div className='max-w-8xl mx-auto text-start p-8'>
                    <h1 className='text-[3rem] font-extrabold text-[#0A2540] hover:text-[#FF4500] duration-150'>
                        Reliable Bulk Milk Transportation
                    </h1>
                    <p className='mt-4 text-lg font-semibold text-[#F4F4F4]'>
                        Delivering fresh milk products safely across cities with our cold-chain logistics
                    </p>
                    <button className="bg-[#FF4500] hover:bg-[#E63946] mt-4 text-white px-6 py-3 rounded-lg">
                        Get Service
                    </button>
                </div>
            </div>

            <div id="service" className='py-16 bg-white text-[#374151]'>
                <div className='max-w-7xl mx-auto text-center'>
                    <h2 className="text-[#1E293B] font-poppins text-3xl font-bold">Our Services</h2>
                    <p className='text-lg text-[#374151] mt-2'>We provide a range of milk transportation solutions.</p>
                </div>
                <div className='mt-8 grid md:grid-cols-3 gap-8'>
                    <div className='p-6 border rounded-lg shadow-lg hover:shadow-2xl'>
                        <h3 className='text-xl font-semibold text-[#0070F3]'>16ft & 19ft Trucks</h3>
                        <p className='text-[#374151] mt-2'>For larger scale milk product transportation with temperature control</p>
                    </div>
                    <div className='p-6 border rounded-lg shadow-lg hover:shadow-2xl'>
                        <h3 className='text-xl font-semibold text-[#0070F3]'>Pickup Trucks</h3>
                        <p className='text-[#374151]'>Perfect for smaller bulk deliveries and quick transport.</p>
                    </div>
                    <div className='p-6 border rounded-lg shadow-lg hover:shadow-2xl'>
                        <h3 className='text-xl font-semibold text-[#0070F3]'>Cold Chain Logistics</h3>
                        <p className='text-[#374151] mt-2'>Ensuring the freshness of milk products during transit</p>
                    </div>
                </div>
            </div>

            <section className="bg-gradient-to-r from-[#FF512F] to-[#DD2476] py-12 text-center text-white">
                <h2 className="text-3xl font-bold">Ready to Transport with Us?</h2>
                <p className="mt-4 text-lg">Get in touch and request a quote today.</p>
                <a href="#quote" className="mt-6 inline-block bg-[#FFD700] text-[#002B5B] font-semibold px-8 py-3 rounded-lg hover:bg-[#FFECB3]">
                    Request a Quote
                </a>
            </section>

            <footer className="bg-[#0A2540] text-[#F4F4F4] py-8 px-2">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-white">Jagdamba Transport Services</h3>
                        <p className="mt-2">Delivering fresh dairy products across India.</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <p>Contact: +91 12345 67890</p>
                        <p>Email: jagdambatransport@gmail.com</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex space-x-4">
                        <a href="#" className="hover:text-[#FFA500]">Facebook</a>
                        <a href="#" className="hover:text-[#FFA500]">Instagram</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default HomePage
