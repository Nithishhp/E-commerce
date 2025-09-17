import { PLANTS } from '@/constants/data';
import Card from '../ui/Card';
import Button from '../ui/Button';

export default function FeaturedSaplings() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Saplings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANTS.map((plant) => (
            <Card
              key={plant.id}
              title={plant.name}
              image={plant.image}
              price={plant.price}
              description={plant.description}
            >
              <Button variant="primary" size="md" className="w-full">
                Add to Cart
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 