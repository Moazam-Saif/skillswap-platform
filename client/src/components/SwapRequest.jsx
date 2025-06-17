export default function(){
    return(
        <div className="relative mx-auto my-20 w-[400px] h-[300px] flex flex-col gap-0 rounded-[15px] bg-[#FFF8F8]">
            <div className="z-10 relative w-full h-[15%] flex gap-0 bg-gradient-to-r from-[#265653CC] to-[#E76F51CC] rounded-tl-[20px] rounded-tr-[20px]">
                <div className="z-20 relative w-1/2 h-full rounded-tl-[15px] bg-[#FFF8F8] mb-[1px]">First Name</div>
                <div className="z-20 relative w-1/2 h-full rounded-tr-[15px] bg-[#FFF8F8] mb-[1px]">Last Name</div>
            </div>
            <div className="z-10 absolute left-0 top-[15%] w-1/2 h-[35%] bg-gradient-to-b from-[#265653CC] to-[#E76F51CC]"></div>
            <div className="z-10 absolute left-0 bottom-[15%] w-1/2 h-[35%] bg-gradient-to-b from-[#E76F51CC] to-[#264653CC]"></div>
            <div className="z-10 absolute left-0 bottom-0 w-1/2 h-[15%] bg-gradient-to-r from-[#E76F51CC] to-[#264653CC] rounded-bl-[20px]"></div>
            <div className="relative w-full h-[35%] flex gap-0">
                <div className="z-20 relative w-1/2 h-full bg-[#fff8f8] mr-[1px]">Teaching</div>
                <div className="z-20 relative w-1/2 h-ful bg-[#fff8f8]">Learning</div>
            </div>
            <div className="relative w-full h-[35%] flex gap-0">
                <div className="z-20 relative w-1/2 h-full bg-[#fff8f8] mr-[1px]">Duration</div>
                <div className="z-20 relative w-1/2 h-full bg-[#fff8f8]">Time Slot</div>
            </div>

            <div className="z-10 relative w-full h-[15%] flex gap-0 bg-gradient-to-r from-[#E76F51CC] to-[#264653CC] rounded-bl-[20px] rounded-br-[20px]">
                <div className="z-20 relative w-1/2 h-full rounded-bl-[15px] bg-[#FFF8F8] mt-[1px] mr-[1px]">Request</div>
                <div className="z-20 relative w-1/2 h-full rounded-br-[15px] bg-[#FFF8F8] mt-[1px]">CHAT</div>
            </div>
        </div>
    )
}