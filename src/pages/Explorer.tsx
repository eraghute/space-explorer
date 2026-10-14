import { Link } from "react-router-dom";
import marsImage from "../assets/mars.png";
import apodImage from "../assets/apod.jpg";
import earthImage from "../assets/earth.jpg";
import earthImagery from "../assets/earthImagery.png";

function Explore() {
  return (
    <main className="container py-5">
      {/* Welcome section */}
      <section className="text-center mb-5">
        <h1 className="display-5 fw-bold">Explore the Universe</h1>

        <p className="lead text-secondary mx-auto">
          Discover the universe through NASA imagery, explore our home planet,
          and uncover the science behind weather on Earth and Mars.
        </p>
      </section>

      {/* Feature cards */}
      <section>
        <div className="row g-4">
          {/* NASA APOD */}
          <div className="col-12 col-md-6">
            <div className="card h-100 shadow-sm border-0 overflow-hidden">
              <img
                src={apodImage}
                className="card-img-top"
                alt="Nasa Astronomy Picture of the Day"
                style={{
                  height: "200px",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
              <div className="card-body p-4 d-flex flex-column">
                <h2 className="h4">NASA Astronomy Picture of the Day</h2>

                <p className="text-secondary">
                  Discover a different view of the universe through NASA's daily
                  astronomy image and its explanation.
                </p>

                <Link to="/apod" className="btn btn-primary mt-auto pt-2">
                  Explore astronomy
                </Link>
              </div>
            </div>
          </div>

          {/* Earth Imagery */}
          <div className="col-12 col-md-6">
            <div className="card h-100 shadow-sm border-0 overflow-hidden">
              <img
                src={earthImagery}
                className="card-img-top"
                alt="Earth Imagery"
                style={{
                  height: "200px",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
              <div className="card-body p-4 d-flex flex-column">
                <h2 className="h4">Earth from Space</h2>

                <p className="text-secondary">
                  Browse natural-colour images of Earth captured by NASA's EPIC
                  camera.
                </p>

                <Link to="/epic" className="btn btn-primary mt-auto pt-2">
                  Explore Earth
                </Link>
              </div>
            </div>
          </div>

          {/* Earth Weather */}
          <div className="col-12 col-md-6">
            <div className="card h-100 shadow-sm border-0 overflow-hidden">
              <img
                src={earthImage}
                className="card-img-top"
                alt="Earth Weather"
                style={{
                  height: "200px",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
              <div className="card-body p-4 d-flex flex-column">
                <h2 className="h4">Earth Weather</h2>

                <p className="text-secondary">
                  Explore current weather conditions and forecasts for locations
                  around the world.
                </p>

                <span className="badge rounded-pill text-bg-secondary mt-auto pt-2">
                  Coming soon
                </span>
              </div>
            </div>
          </div>

          {/* Mars Weather */}
          <div className="col-12 col-md-6">
            <div className="card h-100 shadow-sm border-0 overflow-hidden">
              <img
                src={marsImage}
                className="card-img-top"
                alt="Mars Weather"
                style={{
                  height: "200px",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
              <div className="card-body p-4 d-flex flex-column">
                <h2 className="h4">Mars Weather Archive</h2>

                <p className="text-secondary">
                  Investigate historical atmospheric measurements recorded by
                  NASA's InSight mission.
                </p>

                <span className="badge rounded-pill text-bg-secondary mt-auto pt-2">
                  Coming soon
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Explore;
