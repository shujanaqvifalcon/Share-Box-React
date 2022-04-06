import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import { useForm, ValidationError } from '@formspree/react';


const Footer = () => {
  const [modal, setmodal] = useState('opacity-0 invisible');

  
  const [state, handleSubmit] = useForm("meqnlnaw");

  const [contactEmail, setcontactEmail] = useState("");
  const [contactMessage, setcontactMessage] = useState("");


  
  let submitMessage = () =>{
    console.log("submit message")

  }


 

  return (
    <>
    <div className="w-full bg-[#7854F7] mt-[170px] footer">
        <div className="max-w-[1400px] pt-7 pb-7 gap-10 sm:gap-0 flex items-start justify-between flex-col sm:flex-row  mx-auto  px-6">
         <div>
             <Link to="/"><img src="/images/logo2.svg" alt="logo" /></Link>
             <div className="flex items-center gap-5 mt-3">
                 <a href="#"><img src="/images/twitter.svg" className='transition hover:opacity-80' alt="twitter" /></a>
                 <a href="#"><img src="/images/facebook.svg" className='transition hover:opacity-80' alt="facebook" /></a>
                 <a href="#"><img src="/images/rss.svg" className='transition hover:opacity-80' alt="rss" /></a>
                 <a href="#"><img src="/images/instagram.svg" className='transition hover:opacity-80' alt="instagram" /></a>

             </div>
         </div>

         <div className='flex sm:items-center justify-end  flex-col sm:flex-row gap-5  sm:gap-[120px]'>

           <div className='flex flex-col text-white'>
            <Link to="/" className='transition hover:opacity-80' >PRIVACY POLICY</Link>
            <Link to="/" className='transition hover:opacity-80'>Terms and conditions</Link>
           </div>


           <div className='flex flex-col text-white'>
            <div
             onClick={()=>{
              setmodal('opacity-100 visible')
            }}
             className='transition hover:opacity-80 cursor-pointer'>CONTACT US</div>
           </div>


         </div>

        </div>
    </div>



{/* Form */}

<div
        className={`fixed left-0 top-0   mainFixedOverlay w-screen h-screen flex items-center justify-center ${modal}`}
      >
        <div
          className="blackOverlay absolute left-0 top-0 w-full h-full"
          onClick={() => {
            setmodal("opacity-0 invisible");
          }}
        ></div>
        <div
          className={`rounded-lg bg-white whiteBox py-5  px-7  relative z-50 `}
        >
          <div className="flex items-center justify-end">
            <i
              class="fal fa-times cursor-pointer text-black opacity-70 text-2xl"
              onClick={() => {
                setmodal("opacity-0 invisible");

              }}
            ></i>
          </div>

           
           
           <div className="font-bold text-3xl opacity-80 mb-5">Help us Improve</div>

          <form onSubmit={handleSubmit}>
    
      <input
        id="email"
        type="email" 
        name="email"
        value={contactEmail}
        onChange={(e)=> setcontactEmail(e.target.value)}
        className="border border-gray-300 rounded px-3 py-3 outline-none w-full"
        placeholder="Enter your email address"
      />
      <ValidationError 
        prefix="Email" 
        field="email"
        errors={state.errors}
      />
      <textarea
        id="message"
        name="message"
        value={contactMessage}
        onChange={(e)=> setcontactMessage(e.target.value)}
        placeholder="Enter your message..."
        className="border border-gray-300 rounded px-3 py-3 outline-none w-full resize-none h-[260px] mt-5"
      />
      <ValidationError 
        prefix="Message" 
        field="message"
        errors={state.errors}
      />
     <div className="flex items-center justify-center mt-5">
     <button
     onClick={()=>{
      

     setTimeout(() => {
      alert('Submitted successfully')
      setcontactMessage('');
      setcontactEmail('');
     }, 200);
     }}
     type="submit" className="px-12  text-center py-4 rounded-full cursor-pointer text-white transition hover:bg-[#643eee] bg-[#7854F7] " disabled={state.submitting}>
        Submit
      </button>
     </div>
    </form>



        </div>
      </div>


    </>
  )
}

export default Footer