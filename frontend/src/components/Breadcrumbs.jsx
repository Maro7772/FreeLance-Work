import { Link } from "react-router-dom";

const Breadcrumbs = ({ pages = [], currentPage }) => {
  return (
    <nav className="flex mb-6 font-cairo" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse overflow-x-auto whitespace-nowrap scrollbar-hide py-1">
        <li className="inline-flex items-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-primary transition-colors gap-2"
          >
            <div className="p-1.5 bg-gray-50 rounded-lg border border-gray-200">
              <svg
                width="18"
                height="18"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 7.609c.352 0 .69.122.96.343l.111.1 6.25 6.25v.001a1.5 1.5 0 0 1 .445 1.071v7.5a.89.89 0 0 1-.891.891H9.125a.89.89 0 0 1-.89-.89v-7.5l.006-.149a1.5 1.5 0 0 1 .337-.813l.1-.11 6.25-6.25c.285-.285.67-.444 1.072-.444Zm5.984 7.876L16 9.5l-5.984 5.985v6.499h11.968z"
                  fill="#475569"
                  stroke="#475569"
                  strokeWidth=".094"
                />
              </svg>
            </div>
            <span className="hidden md:block">الرئيسية</span>
          </Link>
        </li>

        {pages.map((page, index) => (
          <li key={index}>
            <div className="flex items-center">
              <svg
                className="w-3 h-3 text-gray-400 mx-1 rtl:rotate-180 flex-shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <Link
                to={page.url}
                className="mr-1 text-sm font-medium text-gray-600 hover:text-primary md:mr-2 transition-colors"
              >
                {page.name}
              </Link>
            </div>
          </li>
        ))}

        {currentPage && (
          <li>
            <div className="flex items-center">
              <svg
                className="w-3 h-3 text-gray-400 mx-1 rtl:rotate-180 flex-shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <span className="mr-1 text-sm font-bold text-primary md:mr-2">
                {currentPage}
              </span>
            </div>
          </li>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
