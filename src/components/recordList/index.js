import './style.css';
export default function Recordings({ list }) {
  if (!list.length) {
    return null;
  }

  const handleDownload = (video) => {
    console.log(video.blob)
    const url = URL.createObjectURL(video.blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = video.name;
    a.click();
  };

  return (
    <table style={{ borderCollapse: 'collapse', width: '100%', maxWidth: 500, marginTop: 24 }}>
      <caption>Recordings</caption>
      <thead>
        <tr>
          <th className="cell">ID</th>
          <th className="cell">Name</th>
          <th className="cell">Duration</th>
          <th className="cell">Action</th>
        </tr>
      </thead>
      <tbody>
        {list.map((video, key) => (
          <tr key={video.name}>
            <td className="cell">{key+1}</td>
            <td className="cell">{video.name}</td>
            <td className="cell">{video.duration}</td>
            <td className="cell">
              <button className="cell" onClick={() => handleDownload(video)}>
                Download
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
