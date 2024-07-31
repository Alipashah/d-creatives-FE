import React from "react";

function Invoices() {
  const Data = [
    {
      a: "INV 0217203",
      b: "Stripe",
      c: "$1030",
      d: "Pending",
      e: "Jan 3, 2022",
    },
    {
      a: "INV 0217203",
      b: "Stripe",
      c: "$1030",
      d: "Pending",
      e: "Jan 3, 2022",
    },
    {
      a: "INV 0217203",
      b: "Stripe",
      c: "$1030",
      d: "Pending",
      e: "Jan 3, 2022",
    },
    { a: "INV 0217203", b: "Stripe", c: "$1030", d: "Paid", e: "Jan 3, 2022" },
    { a: "INV 0217203", b: "Stripe", c: "$1030", d: "Paid", e: "Jan 3, 2022" },
  ];
  const Table = ({ data }) => {
    return (
      <div className="relative overflow-x-auto invoice-table">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
          <thead className=" bg-gray-50 invoice-heading">
            <tr>
              <th scope="col" className="px-6 py-3">
                NUMBER
              </th>
              <th scope="col" className="px-6 py-3">
                PAYMENT METHOD
              </th>
              <th scope="col" className="px-6 py-3">
                TOTAL
              </th>
              <th scope="col" className="px-6 py-3">
                STATUS
              </th>
              <th scope="col" className="px-6 py-3">
                CREATED
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr className="bg-white invoice-text border-b">
                <th scope="row" className="px-6 py-4 text-black">
                  {item.a}
                </th>
                <td className="px-6 py-4">{item.b}</td>
                <td className="px-6 py-4">{item.c}</td>
                <td className="px-6 py-4">{item.d}</td>
                <td className="px-6 py-4">{item.e}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  return (
    <div>
      <div className="p-4 sm:ml-64">
        <div className="md:p-4 mt-16">
          <div className="dashboard-heading-02 mb-2">Dashboard . Invoices</div>
          <div className="dashboard-heading mb-5">Invoices</div>
          <div className="md:pe-10">
            <Table data={Data} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Invoices;
