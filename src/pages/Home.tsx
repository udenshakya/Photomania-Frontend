import { useQuery } from "@tanstack/react-query";

const fetchData = async () => {
  const response = await fetch(`http://localhost:8000/api/post/all`);
  const data = await response.json();
  return data.data;
};

const Home = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["post"],
    queryFn: fetchData,
  });

  console.log(data);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching posts</div>;

  return (
    <main>
      <p>Home PAGE</p>
      <div>
        {data.map((item: any) => (
          <div key={item.id}>
            <p>{item.caption}</p>
            <p>{item.id}</p>
            <img src={item.imageUrl} alt="" />
            <p>{item.description} </p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Home;
