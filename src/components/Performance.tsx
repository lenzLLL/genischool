"use client";
import Image from "next/image";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Group A", value: 90, fill: "#C3EBFA" },
  { name: "Group B", value: 10, fill: "#FAE27C" },
];

const FeesDiagram = () => {
  return (
    <div className="bg-white p-4 rounded-md h-80 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Fees School</h1>
        <Image src="/moreDark.png" alt="" width={16} height={16} />
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            dataKey="value"
            startAngle={180}
            endAngle={0}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            fill="#8884d8"
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-3xl font-bold">90%</h1>
      </div>
      
      <h2 className="font-medium absolute bottom-7 left-0 right-0 m-auto text-center">
      <p className="text-sm text-gray-600">2000XAF / 2220 XAF</p>
      <div className="flex flex-col mt-4 gap-1 items-start justify-start pl-10">
          <div className="flex items-center gap-3">
              <div className="bg-[#C3EBFA] h-5 w-5 rounded-full"></div><h2 className="text-md">Paid Fees</h2>  
          </div>
          <div className="flex items-center gap-3">
              <div className="bg-[#FAE27C] h-5 w-5 rounded-full"></div><h2>Fees To Paid</h2>  
          </div>
      </div>  
       
      </h2>
    </div>
  );
};

export default FeesDiagram;
