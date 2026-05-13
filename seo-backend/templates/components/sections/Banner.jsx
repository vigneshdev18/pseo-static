export default function Banner({ heading }) {
  return (
    <section className="px-6 lg:px-24 py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl lg:text-5xl font-bold leading-tight">{heading}</h2>
        <p className="mt-6 text-indigo-100 text-lg max-w-2xl mx-auto">
          Join thousands of sales teams using verified B2B contact data to build pipeline faster.
        </p>
      </div>
    </section>
  );
}
