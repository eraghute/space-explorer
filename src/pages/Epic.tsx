import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEpicImages, getEpicImageUrl } from "../api/epicApi";
import EpicThumbnail from "../components/EpicThumbnail";

function Epic() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const {
    data: images,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["epic-images"],
    queryFn: fetchEpicImages,
    staleTime: 30 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const epicImages = images ?? [];

  if (isLoading) {
    return <p className="container mt-4">Loading Earth imagery...</p>;
  }

  if (isError) {
    return (
      <div className="container mt-4">
        <p className="alert alert-danger">{error.message}</p>
        <button className="btn btn-primary" onClick={() => refetch()}>
          Try again
        </button>
      </div>
    );
  }

  if (epicImages.length === 0) {
    return (
      <main className="container py-5">
        <h1>Earth from Space</h1>
        <p>No Earth images are currently available.</p>
        <button
          className="btn btn-primary"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          Refresh images
        </button>
      </main>
    );
  }

  const selectedImage = epicImages[selectedIndex] ?? epicImages[0];

  function showPrevious() {
    setSelectedIndex(
      (current) => (current - 1 + epicImages.length) % epicImages.length,
    );
  }

  function showNext() {
    setSelectedIndex((current) => (current + 1) % epicImages.length);
  }

  function formatCaptureDate(date: string) {
    // NASA's EPIC date is supplied in UTC.
    const utcDate = new Date(`${date.replace(" ", "T")}Z`);

    return utcDate.toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "UTC",
    });
  }

  return (
    <main className="container py-4 py-md-5">
      <div className="mb-4">
        <h1 className="fw-bold">Earth from Space</h1>
        <p className="text-secondary mb-0">
          Explore natural-colour images of Earth captured by NASA's EPIC camera.
        </p>
      </div>

      {/* Main image viewer */}
      <div className="mb-4">
        <div
          className="rounded-3 overflow-hidden bg-black d-flex align-items-center justify-content-center"
          style={{ minHeight: "300px" }}
        >
          <img
            src={getEpicImageUrl(selectedImage)}
            alt={`Earth captured on ${selectedImage.date}`}
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
            className="img-fluid"
            style={{
              width: "100%",
              maxHeight: "600px",
              objectFit: "contain",
            }}
          />
          {imageError && (
            <p className="text-danger">
              Failed to load image. Please try again later.
            </p>
          )}
        </div>
      </div>

      {/* Selected image details and navigation */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <p className="text-secondary small mb-1">SELECTED CAPTURE</p>
          <h5 className="mb-1">Earth observation</h5>
          <p className="text-secondary mb-0">
            {formatCaptureDate(selectedImage.date)} UTC
          </p>
        </div>

        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-outline-secondary"
            onClick={showPrevious}
            disabled={epicImages.length < 2}
            aria-label="Previous Earth image"
          >
            &#8592; Previous
          </button>

          <span className="text-nowrap small">
            {selectedIndex + 1} / {epicImages.length}
          </span>

          <button
            className="btn btn-outline-secondary"
            onClick={showNext}
            disabled={epicImages.length < 2}
            aria-label="Next Earth image"
          >
            Next &#8594;
          </button>
        </div>
      </div>

      {/* Thumbnail gallery */}
      <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
        <h5 className="mb-0">Browse captures by date & time</h5>

        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          {isFetching ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="d-flex gap-3 overflow-auto pb-3">
        {epicImages.map((image, index) => (
          <EpicThumbnail
            key={image.identifier}
            date={formatCaptureDate(image.date)}
            selected={index === selectedIndex}
            onClick={() => setSelectedIndex(index)}
          />
        ))}
      </div>
    </main>
  );
}

export default Epic;
