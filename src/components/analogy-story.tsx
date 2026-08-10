type AnalogyStoryProps = {
  title: string;
  scene: string;
  mapping: string;
  takeaway: string;
  boundary: string;
};

export function AnalogyStory({ title, scene, mapping, takeaway, boundary }: AnalogyStoryProps) {
  return (
    <section className="analogy-story" aria-label={`生活比喻：${title}`}>
      <header className="analogy-story-heading">
        <span>生活场景</span>
        <strong>{title}</strong>
      </header>

      <p className="analogy-story-scene">{scene}</p>

      <dl className="analogy-story-details">
        <div>
          <dt>角色映射</dt>
          <dd>{mapping}</dd>
        </div>
        <div>
          <dt>换回技术语言</dt>
          <dd>{takeaway}</dd>
        </div>
        <div className="analogy-story-boundary">
          <dt>类比到这里为止</dt>
          <dd>{boundary}</dd>
        </div>
      </dl>
    </section>
  );
}
