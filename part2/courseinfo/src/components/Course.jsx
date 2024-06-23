const Header = ({ course }) => <h1>{course}</h1>;

const Total = ({ sum }) => (
  <p>
    <b>total of {sum} exercises</b>
  </p>
);

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Content = ({ parts }) =>
  parts.map((el) => <Part key={el.id} part={el} />);

const Course = ({ course }) => {
  const { name, parts, id } = course;

  const total = parts.reduce((acc, curr) => acc + curr.exercises, 0);

  return (
    <div>
      <Header course={name} />
      <Content parts={parts} />
      <Total sum={total} />
    </div>
  );
};

export default Course;
