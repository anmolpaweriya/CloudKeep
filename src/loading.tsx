export default function Loading() {
    return <div className="flex  w-full  justify-center items-center " style={{ height: "100%" }}>

        <svg style={{ width: "200px" }}
            viewBox="0 0 300 150"><path fill="none" stroke="#000000" strokeWidth="15" strokeLinecap="round" strokeDasharray="300 385" strokeDashoffset="0" d="M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z" data-darkreader-inline-stroke=""><animate attributeName="stroke-dashoffset" calcMode="spline" dur="4" values="685;-685" keySplines="0 0 1 1" repeatCount="indefinite"></animate></path></svg>
    </div>
}