import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import {
  GET_CONTINENTS,
  GET_COUNTRIES_BY_CONTINENTS,
  SEARCH_COUNTRIES,
} from "../utils/gql/Queries";
import "../components/Data.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";

export type country = {
  code: string;
  name: string;
  capital: string;
  currency: string;
  continent: {
    name: string;
  };
  states: {
    name: string;
  }[];
  languages: general[];
};
export type selectedCountry = {
  name: string;
  capital: string;
  currency: string;
};
export type general = {
  code: string;
  name: string;
};

export type flags = {
  name: { common: string };
  flags: { png: string };
  population: number;
};

export type code = {
  name: string;
  code: string;
};

const Home = () => {
  //States para el filtro de continentes

  const [selectedContinents, setSelectedContinents] = useState<general[]>([]);

  // LazyQuery para el filtro de continentes
  const [
    loadCountries,
    { loading: countriesLoading, error: countriesError, data: countriesData },
  ] = useLazyQuery(GET_COUNTRIES_BY_CONTINENTS);
  const [
    loadContinents,
    {
      loading: continentsLoading,
      error: continentsError,
      data: continentsData,
    },
  ] = useLazyQuery(GET_CONTINENTS);

  //UseEffect para el filtro de continentes
  useEffect(() => {
    loadContinents();
  }, []);

  //Filtro de continentes

  const handleContinentClick = (code: any) => {
    const updatedSelection: any = selectedContinents.includes(code)
      ? selectedContinents.filter((continent) => continent !== code)
      : [...selectedContinents, code];

    setSelectedContinents(updatedSelection);
    loadCountries({ variables: { continentCodes: updatedSelection } });
  };

  // Fin filtro de continentes
  const [countryName, setCountryName] = useState("");

  const [searchCountries, { loading, error, data }] =
    useLazyQuery(SEARCH_COUNTRIES);

  useEffect(() => {
    if (data && data.countries) {
      setCountryName(data.countries);
    }
    searchCountries();
  }, [data]);

  const [flagsCountries, setFLagsCountries] = useState<flags[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        if (!response.ok) {
          throw new Error("La red no responde");
        }
        const data = await response.json();

        setFLagsCountries(data);
        console.log(flagsCountries);
      } catch (error) {
        console.error("Error obteniendo datos:", error);
      }
    };

    fetchData();
  }, []);
  const getFlagByCountryName = (countryNameFlag: string) => {
    const country = flagsCountries.find(
      (country) => country.name.common === countryNameFlag
    );
    return country ? country.flags.png : "";
  };

  const getPopulationContry = (countryNamePopulation: string) => {
    const contryPopulation = flagsCountries.find(
      (country) => country.name.common === countryNamePopulation
    );
    console.log(contryPopulation);
    return contryPopulation
      ? parseInt(contryPopulation.population.toString().substring(0, 3), 10)
      : "";
  };

  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    if (!inputValue) {
      setFocused(false);
    }
  };

  const handleInputChange = (event: { target: { value: string } }) => {
    setInputValue(event.target.value);
    setSearchTerm(event.target.value);
  };
  ///Modal de Filtro de Continente
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleClearSelection = () => {
    setSelectedContinents([]);
  };

  // Seleccione Pais
  const [states, setStates] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<country | null>(null);

  const handleCountryClick = (country: country) => {
    setSelectedCountry(country);
    setStates("");
    const getStates = selectedCountry?.states.map(
      (state: { name: string }) => state.name
    );
    const dataStates = getStates?.join("\n");
    setStates(dataStates as string);
    toggleOffcanvas();
  };
  //offcanvas pais seleccionado
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

  const toggleOffcanvas = () => {
    setIsOffcanvasOpen(!isOffcanvasOpen);
  };

  ///Buscador de paises
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredCountries =
    data?.countries.filter((country: general) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
  ///Modal

  const customStyles = {
    overlay: {
      backgroundColor: "transparent",
      position: "unset",
    },
    content: {
      border: "none",
      backgroundColor: "#fff",
      top: "26.5rem",
      left: "46.5rem",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "50px",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px",
    },
  };

  return (
    <>
      <div className="contenedor-search">
        <div className="form-group">
          <input
            type="text"
            placeholder="Escribe el país que deseas ver"
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleInputChange}
            value={searchTerm}
            onClick={() => setModalIsOpen(true)}
          />
          <label
            className={
              focused || inputValue ? "label-group focused" : "label-group"
            }
          >
            País
          </label>
          <div className="underline"></div>
        </div>

        <div className="search-icon-container">
          <div className="row">
            <div className="col search-icon-image">
              <FontAwesomeIcon
                icon={faSearch}
                size="lg"
                style={{ color: "#ffffff" }}
              />
            </div>
            <div className="col search-icon-text">Buscar</div>
          </div>
        </div>
      </div>

      <div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Ejemplo de Modal"
          // @ts-ignore
          style={customStyles}
          shouldCloseOnOverlayClick={true}
        >
          <div style={customStyles.header}>
            <h2 className="title-modal">Filtrar por continentes</h2>
            <p className="text-clear-modal" onClick={handleClearSelection}>
              Limpiar
            </p>
          </div>
          <div
            className="grid-container"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
            }}
          >
            {continentsLoading ? <p>Cargando continentes...</p> : null}
            {continentsError ? (
              <p>Error al cargar continentes: {continentsError.message}</p>
            ) : null}
            {continentsData &&
              continentsData.continents.map((continent: general) => (
                <div key={continent.code} style={{ textAlign: "center" }}>
                  <img
                    key={continent.code}
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd5EzVVHwOBc6JqrpP4ysdzs-3mPn0zbcAlqII7XhGovez38Zo9W2-toafWAjnHL580aU&usqp=CAU"
                    alt={continent.name}
                    style={{
                      height: "5rem",
                      borderRadius: "10px",
                      width: "8rem",
                      border: selectedContinents.includes(continent)
                        ? "4px solid #50a8eb"
                        : "none",
                    }}
                    onClick={() => handleContinentClick(continent.code)}
                  />
                  <p>{continent.name}</p>
                </div>
              ))}
          </div>
        </Modal>
      </div>
      {/* Seleccione de continente */}
      <div onClick={() => setModalIsOpen(false)}>
        {selectedContinents.length > 0 && (
          <>
            {countriesLoading ? <p>Cargando países...</p> : null}
            {countriesError ? (
              <p>Error al cargar países: {countriesError.message}</p>
            ) : null}
            <div className="grid-container">
              {countriesData &&
                countriesData.countries.map((country: country) => (
                  <div
                    key={country.code}
                    className="grid-item"
                    onClick={() => handleCountryClick(country)}
                    data-coreui-toggle="offcanvas"
                    data-coreui-target="#offcanvasScrolling"
                    aria-controls="offcanvasScrolling"
                  >
                    <div
                      className="card"
                      style={{ width: "18rem", borderRadius: "50px" }}
                    >
                      <img
                        style={{
                          height: "7rem",
                          borderRadius: "50px 50px 0 0",
                        }}
                        className="data__img"
                        src="https://cdn.pixabay.com/photo/2019/06/24/15/14/bolivia-4296260_150.jpg"
                        alt="data"
                      />
                      <div className="card-body" style={{ height: "7rem" }}>
                        <p className="card-text">
                          <div className="row">
                            <div className="col-md-3">
                              <img
                                style={{ width: "4rem", height: "auto" }}
                                className="data__img"
                                src={getFlagByCountryName(country.name)}
                                alt="data"
                              />
                            </div>
                            <div className="col">
                              <h5 className="country-text">{country.name}</h5>
                              <p className="continente-text">
                                {country.continent.name}
                              </p>
                            </div>
                          </div>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            {/* Fin Seleccione de continente */}

            {/* Mostrar detalle de pais seleccionado mediante Filtro */}

            <div
              className={`offcanvas offcanvas-end  ${
                isOffcanvasOpen ? "show" : ""
              }`}
              data-coreui-scroll="true"
              data-coreui-backdrop="false"
              tabIndex={-1}
              style={{ width: "340px", marginTop: "195px" }}
              id="offcanvasScrolling"
              aria-labelledby="offcanvasScrollingLabel"
            >
              <div className="offcanvas-header">
                <button
                  type="button"
                  className="btn-close"
                  data-coreui-dismiss="offcanvas"
                  aria-label="Close"
                  onClick={toggleOffcanvas}
                  style={{
                    position: "absolute",
                    top: "0",
                    right: "0",
                    margin: "10px",
                  }}
                ></button>
              </div>
              <div className="offcanvas-body  justify-content-center align-items-center">
                <div className="country-details">
                  {selectedCountry && (
                    <div>
                      <img
                        className="country-details-img"
                        src="https://cdn.pixabay.com/photo/2019/06/24/15/14/bolivia-4296260_150.jpg"
                        alt="data"
                      />
                      <div className="row mt-4">
                        <div className="col-md-3">
                          <img
                            style={{
                              height: "3rem",
                              borderRadius: "10px",
                              width: "4rem",
                            }}
                            className="data__img"
                            src={getFlagByCountryName(selectedCountry.name)}
                            alt="data"
                          />
                        </div>
                        <div className="col">
                          <h5 className="country-text">
                            {selectedCountry.name}
                          </h5>
                          <p className="continent-text">
                            {selectedCountry.continent.name}
                          </p>
                        </div>
                      </div>

                      <p className="country-text">
                        Capital:{" "}
                        <span className="continent-text">
                          {selectedCountry.capital}
                        </span>
                      </p>
                      <p className="country-text">
                        Language:
                        {selectedCountry.languages.map(
                          (languages: general, index: number) => (
                            <span className="continent-text" key={index}>
                              {languages.name}&nbsp;
                            </span>
                          )
                        )}
                      </p>
                      <p className="country-text">
                        Population:{" "}
                        <span className="continent-text">
                          {getPopulationContry(selectedCountry.name)}K people
                        </span>{" "}
                      </p>
                      <p className="country-text">
                        Currency:{" "}
                        <span className="continent-text">
                          {selectedCountry.currency}
                        </span>
                      </p>
                      <p className="country-text">Region:</p>

                      <textarea
                        rows={5} // Número de filas para mostrar varios idiomas
                        cols={30} // Número de columnas
                        value={states}
                        className="continent-text" // Establecemos el valor del textarea como la cadena generada
                        readOnly // Hacemos el textarea de solo lectura para mostrar el texto
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Fin de mostrar detalle de pais seleccionado mediante filtro */}
          </>
        )}
        {selectedContinents.length === 0 && (
          // Mostrar todos los paises
          <div>
            {loading && <p>Cargando...</p>}
            {error && <p>Error al cargar los países</p>}

            {countryName && countryName.length > 0 && (
              <>
                <div className="grid-container">
                  {filteredCountries.map((country: country) => (
                    <div
                      key={country.code}
                      className="grid-item"
                      onClick={() => handleCountryClick(country)}
                      data-coreui-toggle="offcanvas"
                      data-coreui-target="#offcanvasScrolling"
                      aria-controls="offcanvasScrolling"
                    >
                      <div
                        className="card"
                        style={{ width: "18rem", borderRadius: "50px" }}
                      >
                        <img
                          style={{
                            height: "7rem",
                            borderRadius: "50px 50px 0 0",
                          }}
                          className="data__img"
                          src="https://cdn.pixabay.com/photo/2019/06/24/15/14/bolivia-4296260_150.jpg"
                          alt="data"
                        />
                        <div className="card-body" style={{ height: "7rem" }}>
                          <p className="card-text">
                            <div className="row">
                              <div className="col-md-3">
                                <img
                                  style={{ width: "4rem", height: "auto" }}
                                  className="data__img"
                                  src={getFlagByCountryName(country.name)}
                                  alt="data"
                                />
                              </div>
                              <div className="col">
                                <h5 className="country-text">{country.name}</h5>
                                <p className="continente-text">
                                  {country.continent.name}
                                </p>
                              </div>
                            </div>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Fin mostrar todos los paises */}
                <div
                  className={`offcanvas offcanvas-end  ${
                    isOffcanvasOpen ? "show" : ""
                  }`}
                  data-coreui-scroll="true"
                  data-coreui-backdrop="false"
                  tabIndex={-1}
                  style={{ width: "340px", marginTop: "195px" }}
                  id="offcanvasScrolling"
                  aria-labelledby="offcanvasScrollingLabel"
                >
                  <div className="offcanvas-header">
                    <button
                      type="button"
                      className="btn-close"
                      data-coreui-dismiss="offcanvas"
                      aria-label="Close"
                      onClick={toggleOffcanvas}
                      style={{
                        position: "absolute",
                        top: "0",
                        right: "0",
                        margin: "10px",
                      }}
                    ></button>
                  </div>
                  <div className="offcanvas-body  justify-content-center align-items-center">
                    <div className="country-details">
                      {selectedCountry && (
                        <div>
                          <img
                            className="country-details-img"
                            src="https://cdn.pixabay.com/photo/2019/06/24/15/14/bolivia-4296260_150.jpg"
                            alt="data"
                          />
                          <div className="row mt-4">
                            <div className="col-md-3">
                              <img
                                style={{
                                  height: "3rem",
                                  borderRadius: "10px",
                                  width: "4rem",
                                }}
                                className="data__img"
                                src={getFlagByCountryName(selectedCountry.name)}
                                alt="data"
                              />
                            </div>
                            <div className="col">
                              <h5 className="country-text">
                                {selectedCountry.name}
                              </h5>
                              <p className="continent-text">
                                {selectedCountry.continent.name}
                              </p>
                            </div>
                          </div>

                          <p className="country-text">
                            Capital:{" "}
                            <span className="continent-text">
                              {selectedCountry.capital}
                            </span>
                          </p>
                          <p className="country-text">
                            Language:
                            {selectedCountry.languages.map(
                              (languages: general, index: number) => (
                                <span className="continent-text" key={index}>
                                  {languages.name}&nbsp;
                                </span>
                              )
                            )}
                          </p>
                          <p className="country-text">
                            Population:{" "}
                            <span className="continent-text">
                              {getPopulationContry(selectedCountry.name)}K
                              people
                            </span>{" "}
                          </p>
                          <p className="country-text">
                            Currency:{" "}
                            <span className="continent-text">
                              {selectedCountry.currency}
                            </span>
                          </p>
                          <p className="country-text">Region:</p>

                          <textarea
                            rows={5}
                            cols={30}
                            value={states}
                            className="continent-text"
                            readOnly
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
