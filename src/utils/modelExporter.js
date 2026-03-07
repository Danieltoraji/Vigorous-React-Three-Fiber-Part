/**
 * 模型导出器 - 支持 Vigorous 棋子编辑器的所有几何类型
 * 
 * 功能说明：
 * 1. 根据棋子数据 JSON 生成对应的 Three.js 几何体
 * 2. 支持 STL 和 OBJ 格式导出
 * 3. 模型生成逻辑与 modelrenderer.jsx 完全一致
 * 
 * 支持的几何体类型：
 * - cycle: 圆柱体
 * - polygon: 多边形棱柱
 * - cube: 长方体/正方体
 * - special: 异形（旋转体/扫掠体）
 * 
 * 支持的组件：
 * - base: 底座组件
 * - column: 柱体组件
 * - decoration: 装饰物组件
 * - pattern: 浮雕图案
 */

import {
  MeshStandardMaterial,
  CylinderGeometry,
  BoxGeometry,
  SphereGeometry,
  Mesh,
  Matrix4,
  BufferGeometry,
  Float32BufferAttribute,
  Vector3,
  LatheGeometry,
  Group,
  Shape,
  ExtrudeGeometry
} from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

/**
 * 创建扫掠几何体（异形 - 有路径曲线）
 * 
 * 算法说明：
 * 1. 轮廓曲线坐标转换：canvas -> (m,n)
 *    - m = (point.x - 140) / 140  归一化半径因子，范围 [-1, 1]
 *    - n = (point.y - 75) / 8     高度
 * 
 * 2. 路径曲线坐标转换：canvas -> (x,z)
 *    - x = (point.x - 140) / 4    canvas x -> 3D x
 *    - z = -(point.y - 75) / 4    canvas y -> 3D z
 * 
 * 3. 顶点计算公式：
 *    - X = factor * m * pathX
 *    - Y = factor * (-n)
 *    - Z = factor * m * pathZ
 *    - factor = 2（缩放因子）
 * 
 * @param {Array} profilePoints - 轮廓点数组 [{x, y}]
 * @param {Array} pathPoints - 路径点数组 [{x, y}]
 * @returns {BufferGeometry|null} - 生成的几何体
 */
function createSweepGeometry(profilePoints, pathPoints) {
  console.log('[createSweepGeometry] 开始生成扫掠几何体');
  console.log('[createSweepGeometry] 轮廓点数量:', profilePoints?.length);
  console.log('[createSweepGeometry] 路径点数量:', pathPoints?.length);

  if (!profilePoints || profilePoints.length < 3 || !pathPoints || pathPoints.length < 3) {
    console.warn('[createSweepGeometry] 点数不足，返回 null');
    return null;
  }

  try {
    // 轮廓曲线坐标转换 (canvas -> (m,n))
    const profile3D = profilePoints.map(point => {
      const m = (point.x - 140) / 140;
      const n = (point.y - 75) / 8;
      return { m, n };
    });
    console.log('[createSweepGeometry] 轮廓曲线转换完成，首点:', profile3D[0]);

    // 路径曲线坐标转换 (canvas -> (x,z))
    const path3D = pathPoints.map(point => {
      const x = (point.x - 140) / 4;
      const z = -(point.y - 75) / 4;
      return { x, z };
    });
    console.log('[createSweepGeometry] 路径曲线转换完成，首点:', path3D[0]);

    // 创建扫掠几何体的顶点
    const vertices = [];
    const profileSteps = profile3D.length;
    const pathSteps = path3D.length;

    // 沿着路径曲线的每个点
    for (let i = 0; i < pathSteps; i++) {
      const pathPoint = path3D[i];

      // 在路径点上应用轮廓曲线的缩放
      for (let j = 0; j < profileSteps; j++) {
        const profilePoint = profile3D[j];
        const factor = 2; // 缩放因子
        // 应用映射规则：X=m*x, Y=n, Z=m*z
        const X = factor * profilePoint.m * pathPoint.x;
        const Y = factor * (-profilePoint.n);
        const Z = factor * profilePoint.m * pathPoint.z;

        vertices.push(new Vector3(X, Y, Z));
      }
    }
    console.log('[createSweepGeometry] 顶点计算完成，总数:', vertices.length);

    // 构建 BufferGeometry
    const positions = [];
    const indices = [];

    // 填充顶点位置
    for (const vertex of vertices) {
      positions.push(vertex.x, vertex.y, vertex.z);
    }

    // 构建索引（连接顶点形成面）
    for (let i = 0; i < pathSteps - 1; i++) {
      for (let j = 0; j < profileSteps - 1; j++) {
        const a = i * profileSteps + j;
        const b = i * profileSteps + (j + 1);
        const c = (i + 1) * profileSteps + j;
        const d = (i + 1) * profileSteps + (j + 1);

        // 两个三角形组成一个四边形
        indices.push(a, b, c);
        indices.push(c, b, d);
      }
    }
    console.log('[createSweepGeometry] 索引构建完成，总数:', indices.length / 3, '个三角形');

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    console.log('[createSweepGeometry] 扫掠几何体生成成功');
    return geometry;
  } catch (error) {
    console.error('[createSweepGeometry] 扫掠几何体生成失败:', error);
    return null;
  }
}

/**
 * 创建旋转体几何体（异形 - 无路径曲线）
 * 
 * 算法说明：
 * 1. Canvas 坐标转换为 3D 坐标
 *    - radius = (point.x - 140) / 8  半径
 *    - height = -(point.y - 75) / 8  高度（取负，因为 canvas y 向下为正）
 * 
 * 2. 使用 LatheGeometry 绕 Y 轴旋转生成几何体
 * 
 * @param {Array} profilePoints - 轮廓点数组 [{x, y}]
 * @returns {LatheGeometry|null} - 生成的几何体
 */
function createLatheGeometryFromProfile(profilePoints) {
  console.log('[createLatheGeometryFromProfile] 开始生成旋转体几何体');
  console.log('[createLatheGeometryFromProfile] 轮廓点数量:', profilePoints?.length);

  if (!profilePoints || profilePoints.length < 3) {
    console.warn('[createLatheGeometryFromProfile] 点数不足，返回 null');
    return null;
  }

  try {
    // Canvas 坐标转换为 3D 坐标
    const profile3D = profilePoints.map(point => {
      const radius = (point.x - 140) / 8;
      const height = -(point.y - 75) / 8;
      return new Vector3(Math.abs(radius), height, 0);
    });
    console.log('[createLatheGeometryFromProfile] 轮廓转换完成，首点:', profile3D[0]);

    const geometry = new LatheGeometry(profile3D, 64, 0, Math.PI * 2);
    console.log('[createLatheGeometryFromProfile] 旋转体几何体生成成功');
    return geometry;
  } catch (error) {
    console.error('[createLatheGeometryFromProfile] 旋转体几何生成失败:', error);
    return null;
  }
}

/**
 * 创建异形几何体（根据是否有路径曲线选择生成方式）
 * 
 * @param {Object} customShape - 自定义形状数据
 * @param {Array} customShape.profilePoints - 轮廓点数组
 * @param {Array} customShape.pathPoints - 路径点数组（可选）
 * @returns {BufferGeometry|null} - 生成的几何体
 */
function createSpecialGeometry(customShape) {
  console.log('[createSpecialGeometry] 开始创建异形几何体');
  
  if (!customShape || !customShape.profilePoints || customShape.profilePoints.length < 3) {
    console.warn('[createSpecialGeometry] customShape 无效或点数不足');
    return null;
  }

  const { profilePoints, pathPoints } = customShape;

  // 有路径曲线则生成扫掠体，否则生成旋转体
  if (pathPoints && pathPoints.length >= 3) {
    console.log('[createSpecialGeometry] 检测到路径曲线，生成扫掠体');
    return createSweepGeometry(profilePoints, pathPoints);
  } else {
    console.log('[createSpecialGeometry] 无路径曲线，生成旋转体');
    return createLatheGeometryFromProfile(profilePoints);
  }
}

/**
 * 创建圆角圆柱几何体
 * 
 * @param {number} radius - 半径
 * @param {number} height - 高度
 * @param {number} radialSegments - 径向分段数
 * @param {string} edgeType - 边缘类型：'none' | 'smooth' | 'round'
 * @param {number} edgeDepth - 边缘深度
 * @param {number} edgeSegments - 边缘分段数
 * @returns {BufferGeometry}
 */
function createRoundedCylinderGeometry(radius, height, radialSegments = 32, edgeType = 'none', edgeDepth = 0, edgeSegments = 4) {
  console.log('[createRoundedCylinderGeometry] 参数:', { radius, height, radialSegments, edgeType, edgeDepth, edgeSegments });

  if (edgeType === 'none' || edgeDepth <= 0) {
    console.log('[createRoundedCylinderGeometry] 无边缘处理，使用普通圆柱');
    return new CylinderGeometry(radius, radius, height, radialSegments);
  }

  const safeDepth = Math.min(edgeDepth, height / 4, radius / 2);
  console.log('[createRoundedCylinderGeometry] 安全深度:', safeDepth);

  // 创建圆形形状（在 XY 平面）
  const shape = new Shape();
  const segments = Math.max(16, radialSegments);
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }
  shape.closePath();

  const extrudeSettings = {
    depth: height,
    bevelEnabled: true,
    bevelThickness: safeDepth,
    bevelSize: safeDepth,
    bevelSegments: edgeSegments,
    curveSegments: segments
  };

  const geometry = new ExtrudeGeometry(shape, extrudeSettings);
  // Extrude 沿 Z 轴挤压，旋转 90 度让高度沿 Y 轴
  geometry.rotateX(-Math.PI / 2);
  
  console.log('[createRoundedCylinderGeometry] 圆角圆柱生成成功');
  return geometry;
}

/**
 * 创建圆角立方体几何体
 * 
 * @param {number} width - 宽度
 * @param {number} height - 高度
 * @param {number} depth - 深度
 * @param {string} edgeType - 边缘类型：'none' | 'smooth' | 'round'
 * @param {number} edgeDepth - 边缘深度
 * @param {number} edgeSegments - 边缘分段数
 * @returns {BufferGeometry}
 */
function createRoundedBoxGeometry(width, height, depth, edgeType = 'none', edgeDepth = 0, edgeSegments = 4) {
  console.log('[createRoundedBoxGeometry] 参数:', { width, height, depth, edgeType, edgeDepth, edgeSegments });

  if (edgeType === 'none' || edgeDepth <= 0) {
    console.log('[createRoundedBoxGeometry] 无边缘处理，使用普通立方体');
    return new BoxGeometry(width, height, depth, 1, 1, 1);
  }

  const minSize = Math.min(width, height, depth);
  const safeDepth = Math.min(edgeDepth, minSize / 4);
  console.log('[createRoundedBoxGeometry] 安全深度:', safeDepth);

  // 创建矩形形状（在 XY 平面）
  const shape = new Shape();
  shape.moveTo(-width / 2, -depth / 2);
  shape.lineTo(width / 2, -depth / 2);
  shape.lineTo(width / 2, depth / 2);
  shape.lineTo(-width / 2, depth / 2);
  shape.closePath();

  const extrudeSettings = {
    depth: height,
    bevelEnabled: true,
    bevelThickness: safeDepth,
    bevelSize: safeDepth,
    bevelSegments: edgeSegments,
    curveSegments: 1
  };

  const geometry = new ExtrudeGeometry(shape, extrudeSettings);
  // Extrude 沿 Z 轴挤压，旋转 90 度让高度沿 Y 轴
  geometry.rotateX(-Math.PI / 2);
  // 平移让底部在 y=0，中心在 y=height/2
  geometry.translate(0, height / 2, 0);

  console.log('[createRoundedBoxGeometry] 圆角立方体生成成功');
  return geometry;
}

/**
 * 创建底座几何体
 * 
 * 支持的类型：
 * - cycle: 圆柱体，使用 CylinderGeometry(size1, size2, height, 64)
 * - polygon: 多边形棱柱，使用 CylinderGeometry(size1, size2, height, sides)
 * - cube: 长方体，使用 BoxGeometry(size1, height, size2)
 * - special: 异形，使用 createSpecialGeometry
 * 
 * 位置计算：
 * - 普通类型: [position.x, position.y + height/2, position.z]
 * - 异形类型: [position.x, position.y, position.z]
 * 
 * @param {Object} baseData - 底座数据
 * @returns {BufferGeometry|null} - 生成的几何体
 */
function createBaseGeometry(baseData) {
  console.log('[createBaseGeometry] 开始创建底座几何体');

  if (!baseData || !baseData.shape) {
    console.warn('[createBaseGeometry] baseData 或 shape 无效');
    return null;
  }

  const shape = baseData.shape;
  const { type, size1, size2, height, sides } = shape;
  const position = baseData.position || { x: 0, y: 0, z: 0 };
  const edge = baseData.edge || { type: 'none', depth: 0, segments: 4 };

  console.log('[createBaseGeometry] 形状类型:', type);
  console.log('[createBaseGeometry] 尺寸:', { size1, size2, height, sides });
  console.log('[createBaseGeometry] 位置:', position);
  console.log('[createBaseGeometry] 边缘:', edge);

  let geometry = null;

  switch (type) {
    case 'cycle':
      console.log('[createBaseGeometry] 创建圆柱体底座');
      if (edge.type === 'smooth' || edge.type === 'round') {
        const segments = edge.type === 'round' ? 128 : (edge.segments || 4);
        geometry = createRoundedCylinderGeometry(size1 / 2, height, 512, 'smooth', edge.depth, segments);
      } else {
        // 与 modelrenderer 一致：args={[size1, size2, height, 64]}
        geometry = new CylinderGeometry(size1, size2, height, 64);
      }
      break;

    case 'polygon':
      console.log('[createBaseGeometry] 创建多边形棱柱底座');
      const polygonSides = sides || 6;
      if (edge.type === 'smooth' || edge.type === 'round') {
        const segments = edge.type === 'round' ? 128 : (edge.segments || 4);
        const radius = size1 / 2;
        const safeDepth = Math.min(edge.depth, Math.min(size1, size2, height) / 4);

        const polygonShape = new Shape();
        for (let i = 0; i < polygonSides; i++) {
          const angle = (i / polygonSides) * Math.PI * 2 - Math.PI / 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          if (i === 0) {
            polygonShape.moveTo(x, y);
          } else {
            polygonShape.lineTo(x, y);
          }
        }
        polygonShape.closePath();

        const extrudeSettings = {
          depth: height,
          bevelEnabled: true,
          bevelThickness: safeDepth,
          bevelSize: safeDepth,
          bevelSegments: segments,
          curveSegments: Math.max(1, polygonSides)
        };

        geometry = new ExtrudeGeometry(polygonShape, extrudeSettings);
        geometry.rotateX(-Math.PI / 2);
      } else {
        // 与 modelrenderer 一致：args={[size1, size2, height, baseSides]}
        geometry = new CylinderGeometry(size1, size2, height, polygonSides);
      }
      break;

    case 'cube':
      console.log('[createBaseGeometry] 创建立方体底座');
      if (edge.type === 'smooth' || edge.type === 'round') {
        const segments = edge.type === 'round' ? 128 : (edge.segments || 4);
        geometry = createRoundedBoxGeometry(size1, height, size2, 'smooth', edge.depth, segments);
      } else {
        // 与 modelrenderer 一致：args={[size1, height, size2]}
        geometry = new BoxGeometry(size1, height, size2);
      }
      break;

    case 'special':
      console.log('[createBaseGeometry] 创建异形底座');
      geometry = createSpecialGeometry(baseData.customShape);
      break;

    default:
      console.warn('[createBaseGeometry] 未知类型，使用默认圆柱');
      geometry = new CylinderGeometry(size1, size2, height, 64);
      break;
  }

  if (!geometry) {
    console.warn('[createBaseGeometry] 几何体生成失败');
    return null;
  }

  // 应用位置变换
  const matrix = new Matrix4();
  if (type === 'special') {
    // 异形：位置直接使用 position
    matrix.makeTranslation(position.x, position.y, position.z);
    console.log('[createBaseGeometry] 异形位置变换:', { x: position.x, y: position.y, z: position.z });
  } else {
    // 普通类型：位置 = position + height/2（居中）
    matrix.makeTranslation(position.x, position.y + height / 2, position.z);
    console.log('[createBaseGeometry] 普通类型位置变换:', { x: position.x, y: position.y + height / 2, z: position.z });
  }
  geometry.applyMatrix4(matrix);

  console.log('[createBaseGeometry] 底座几何体创建成功');
  return geometry;
}

/**
 * 创建柱体几何体
 * 
 * 位置计算：
 * - 普通类型: [position.x, baseheight + height/2 + position.y, position.z]
 * - 异形类型: [position.x, baseheight + height/2 + position.y, position.z]
 * 
 * 注意：baseheight 为底座高度，柱体需要在底座之上
 * 
 * @param {Object} columnData - 柱体数据
 * @param {number} baseheight - 底座高度
 * @returns {BufferGeometry|null} - 生成的几何体
 */
function createColumnGeometry(columnData, baseheight) {
  console.log('[createColumnGeometry] 开始创建柱体几何体');
  console.log('[createColumnGeometry] 底座高度 baseheight:', baseheight);

  if (!columnData || !columnData.shape) {
    console.warn('[createColumnGeometry] columnData 或 shape 无效');
    return null;
  }

  const shape = columnData.shape;
  const { type, size1, size2, height, sides } = shape;
  const position = columnData.position || { x: 0, y: 0, z: 0 };
  const edge = columnData.edge || { type: 'none', depth: 0, segments: 4 };

  console.log('[createColumnGeometry] 形状类型:', type);
  console.log('[createColumnGeometry] 尺寸:', { size1, size2, height, sides });
  console.log('[createColumnGeometry] 位置:', position);
  console.log('[createColumnGeometry] 边缘:', edge);

  let geometry = null;

  switch (type) {
    case 'cycle':
      console.log('[createColumnGeometry] 创建圆柱体柱体');
      if (edge.type === 'smooth' || edge.type === 'round') {
        const segments = edge.type === 'round' ? 128 : (edge.segments || 4);
        geometry = createRoundedCylinderGeometry(size1 / 2, height, 512, 'smooth', edge.depth, segments);
      } else {
        // 与 modelrenderer 一致：args={[size1, size2, height, 64]}
        geometry = new CylinderGeometry(size1, size2, height, 64);
      }
      break;

    case 'polygon':
      console.log('[createColumnGeometry] 创建多边形棱柱柱体');
      const polygonSides = sides || 6;
      if (edge.type === 'smooth' || edge.type === 'round') {
        const segments = edge.type === 'round' ? 128 : (edge.segments || 4);
        const radius = size1 / 2;
        const safeDepth = Math.min(edge.depth, Math.min(size1, size2, height) / 4);

        const polygonShape = new Shape();
        for (let i = 0; i < polygonSides; i++) {
          const angle = (i / polygonSides) * Math.PI * 2 - Math.PI / 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          if (i === 0) {
            polygonShape.moveTo(x, y);
          } else {
            polygonShape.lineTo(x, y);
          }
        }
        polygonShape.closePath();

        const extrudeSettings = {
          depth: height,
          bevelEnabled: true,
          bevelThickness: safeDepth,
          bevelSize: safeDepth,
          bevelSegments: segments,
          curveSegments: Math.max(1, polygonSides)
        };

        geometry = new ExtrudeGeometry(polygonShape, extrudeSettings);
        geometry.rotateX(-Math.PI / 2);
      } else {
        // 与 modelrenderer 一致：args={[size1, size2, height, columnSides]}
        geometry = new CylinderGeometry(size1, size2, height, polygonSides);
      }
      break;

    case 'cube':
      console.log('[createColumnGeometry] 创建立方体柱体');
      if (edge.type === 'smooth' || edge.type === 'round') {
        const segments = edge.type === 'round' ? 128 : (edge.segments || 4);
        geometry = createRoundedBoxGeometry(size1, height, size2, 'smooth', edge.depth, segments);
      } else {
        // 与 modelrenderer 一致：args={[size1, height, size2]}
        geometry = new BoxGeometry(size1, height, size2);
      }
      break;

    case 'special':
      console.log('[createColumnGeometry] 创建异形柱体');
      geometry = createSpecialGeometry(columnData.customShape);
      break;

    default:
      console.warn('[createColumnGeometry] 未知类型，使用默认圆柱');
      geometry = new CylinderGeometry(size1, size2, height, 64);
      break;
  }

  if (!geometry) {
    console.warn('[createColumnGeometry] 几何体生成失败');
    return null;
  }

  // 应用位置变换
  const matrix = new Matrix4();
  // 与 modelrenderer 一致：position={[position.x, baseheight + height/2 + position.y, position.z]}
  const finalY = baseheight + height / 2 + position.y;
  matrix.makeTranslation(position.x, finalY, position.z);
  console.log('[createColumnGeometry] 位置变换:', { x: position.x, y: finalY, z: position.z });
  geometry.applyMatrix4(matrix);

  console.log('[createColumnGeometry] 柱体几何体创建成功');
  return geometry;
}

/**
 * 创建装饰物几何体
 * 
 * 与 modelrenderer 一致：使用 SphereGeometry(2, 32, 32)
 * 
 * @param {Object} decorationData - 装饰物数据
 * @returns {BufferGeometry|null} - 生成的几何体
 */
function createDecorationGeometry(decorationData) {
  console.log('[createDecorationGeometry] 开始创建装饰物几何体');

  if (!decorationData || !decorationData.modelId) {
    console.warn('[createDecorationGeometry] decorationData 无效或无 modelId');
    return null;
  }

  const position = decorationData.position || { x: 0, y: 0, z: 0 };
  console.log('[createDecorationGeometry] 位置:', position);

  // 与 modelrenderer 一致：<sphereGeometry args={[2]} />
  const geometry = new SphereGeometry(2, 32, 32);

  const matrix = new Matrix4().makeTranslation(position.x, position.y, position.z);
  geometry.applyMatrix4(matrix);

  console.log('[createDecorationGeometry] 装饰物几何体创建成功');
  return geometry;
}

/**
 * 创建浮雕图案几何体
 * 
 * 支持的类型：
 * - text: 文字浮雕，使用 TextGeometry
 * - geometry.Circle: 圆形浮雕
 * - geometry.Polygon: 多边形浮雕
 * - geometry.Cube: 立方体浮雕
 * 
 * 位置计算（与 modelrenderer 一致）：
 * - base 的 pattern: position.y + height + pattern.depth/2
 * - column 的 pattern: baseheight + height + position.y + pattern.depth/2
 * 
 * @param {Object} patternData - 浮雕图案数据
 * @param {Object} componentPosition - 组件位置
 * @param {number} componentHeight - 组件高度
 * @param {number} baseheight - 底座高度
 * @param {string} componentType - 组件类型 ('base' | 'column')
 * @returns {BufferGeometry|null} - 生成的几何体
 */
async function createPatternGeometry(patternData, componentPosition, componentHeight, baseheight, componentType) {
  console.log('[createPatternGeometry] 开始创建浮雕图案几何体');
  console.log('[createPatternGeometry] 组件类型:', componentType);
  console.log('[createPatternGeometry] 组件高度:', componentHeight);
  console.log('[createPatternGeometry] 底座高度:', baseheight);

  if (!patternData || patternData.shape === 'none') {
    console.warn('[createPatternGeometry] patternData 无效或 shape 为 none');
    return null;
  }

  const { shape, position: patternPosition, size, depth, geometryType, sides, content } = patternData;
  console.log('[createPatternGeometry] 浮雕类型:', shape);
  console.log('[createPatternGeometry] 浮雕数据:', { size, depth, geometryType, sides, content });

  let geometry = null;

  const posX = patternPosition?.x || 0;
  const posZ = patternPosition?.z || 0;
  const posY = componentPosition?.y || 0;

  switch (shape) {
    case 'text':
      console.log('[createPatternGeometry] 创建文字浮雕');
      try {
        const loader = new FontLoader();
        const font = await new Promise((resolve, reject) => {
          loader.load(
            'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
            resolve,
            undefined,
            reject
          );
        });
        console.log('[createPatternGeometry] 字体加载成功');

        const textGeometry = new TextGeometry(content || 'Text', {
          font: font,
          size: size || 5,
          height: depth || 1,
          curveSegments: 12
        });

        // 与 modelrenderer 一致：rotation={[-Math.PI / 2, 0, 0]}
        textGeometry.rotateX(-Math.PI / 2);

        // 计算文字位置
        let textY;
        if (componentType === 'column') {
          // 与 modelrenderer 一致：baseheight + height + position.y
          textY = baseheight + componentHeight + posY;
        } else {
          // 与 modelrenderer 一致：position.y + height
          textY = posY + componentHeight;
        }
        console.log('[createPatternGeometry] 文字位置 Y:', textY);

        const matrix = new Matrix4().makeTranslation(posX, textY, posZ);
        textGeometry.applyMatrix4(matrix);

        geometry = textGeometry;
        console.log('[createPatternGeometry] 文字浮雕创建成功');
      } catch (error) {
        console.error('[createPatternGeometry] 文字几何体生成失败:', error);
        return null;
      }
      break;

    case 'geometry':
      console.log('[createPatternGeometry] 创建几何体浮雕，类型:', geometryType);
      
      // 计算几何体位置
      let patternY;
      if (componentType === 'column') {
        // 与 modelrenderer 一致：baseheight + height + position.y + pattern.depth / 2
        patternY = baseheight + componentHeight + posY + (depth || 1) / 2;
      } else {
        // 与 modelrenderer 一致：position.y + height + pattern.depth / 2
        patternY = posY + componentHeight + (depth || 1) / 2;
      }
      console.log('[createPatternGeometry] 几何体位置 Y:', patternY);

      switch (geometryType) {
        case 'Circle':
          // 与 modelrenderer 一致：<cylinderGeometry args={[pattern.size, pattern.size, pattern.depth, 64]} />
          geometry = new CylinderGeometry(size, size, depth, 64);
          console.log('[createPatternGeometry] 圆形浮雕创建成功');
          break;
        case 'Polygon':
          // 与 modelrenderer 一致：<cylinderGeometry args={[pattern.size, pattern.size, pattern.depth, pattern.sides || 6]} />
          geometry = new CylinderGeometry(size, size, depth, sides || 6);
          console.log('[createPatternGeometry] 多边形浮雕创建成功');
          break;
        case 'Cube':
          // 与 modelrenderer 一致：<boxGeometry args={[pattern.size, pattern.depth, pattern.size]} />
          geometry = new BoxGeometry(size, depth, size);
          console.log('[createPatternGeometry] 立方体浮雕创建成功');
          break;
        default:
          console.warn('[createPatternGeometry] 未知的几何体类型:', geometryType);
          return null;
      }

      const matrix = new Matrix4().makeTranslation(posX, patternY, posZ);
      geometry.applyMatrix4(matrix);
      break;

    default:
      console.warn('[createPatternGeometry] 未知的浮雕类型:', shape);
      return null;
  }

  console.log('[createPatternGeometry] 浮雕图案几何体创建成功');
  return geometry;
}

/**
 * 创建材质
 * 
 * @param {Object} materialData - 材质数据
 * @param {string} defaultColor - 默认颜色
 * @returns {MeshStandardMaterial} - 创建的材质
 */
function createMaterial(materialData, defaultColor) {
  const {
    color = defaultColor,
    metalness = 0.3,
    roughness = 0.4,
    clearcoat = 0,
    clearcoatRoughness = 0
  } = materialData || {};

  console.log('[createMaterial] 创建材质，颜色:', color);

  return new MeshStandardMaterial({
    color,
    metalness,
    roughness,
    clearcoat,
    clearcoatRoughness
  });
}

/**
 * 导出棋子模型为指定格式
 * 
 * @param {Object} chessData - 棋子数据对象
 * @param {string} format - 导出格式 ('stl' 或 'obj')
 * @returns {Promise<Blob>} - 导出的文件 Blob
 */
export async function exportChessModel(chessData, format = 'stl') {
  console.log('========================================');
  console.log('[exportChessModel] 开始导出棋子模型');
  console.log('[exportChessModel] 导出格式:', format);
  console.log('========================================');

  try {
    if (!chessData || !chessData.parts) {
      throw new Error('无效的棋子数据');
    }

    console.log('[exportChessModel] 棋子数据:', JSON.stringify(chessData, null, 2));

    const meshes = [];
    const base = chessData.parts.base;
    const column = chessData.parts.column;
    const decoration = chessData.parts.decoration;

    // 获取底座高度，用于计算柱体位置
    const baseheight = base?.shape?.height || 0;
    console.log('[exportChessModel] 底座高度:', baseheight);

    // ========== 处理底座组件 ==========
    console.log('\n[exportChessModel] ----- 处理底座组件 -----');
    if (base && base.shape) {
      console.log('[exportChessModel] 底座数据存在，开始生成几何体');
      const baseGeometry = createBaseGeometry(base);
      if (baseGeometry) {
        const baseMaterial = createMaterial(base.material, '#8B4513');
        const baseMesh = new Mesh(baseGeometry, baseMaterial);
        if (baseMesh && baseMesh.geometry) {
          meshes.push(baseMesh);
          console.log('[exportChessModel] ✓ 成功添加 base 组件');
        }

        // 处理底座浮雕图案
        if (base.pattern && base.pattern.shape !== 'none') {
          console.log('[exportChessModel] 检测到底座浮雕图案');
          const patternGeometry = await createPatternGeometry(
            base.pattern,
            base.position,
            base.shape.height,
            0,
            'base'
          );
          if (patternGeometry) {
            const patternMaterial = createMaterial(base.material, '#CD853F');
            const patternMesh = new Mesh(patternGeometry, patternMaterial);
            if (patternMesh && patternMesh.geometry) {
              meshes.push(patternMesh);
              console.log('[exportChessModel] ✓ 成功添加 base 浮雕图案');
            }
          }
        }
      } else {
        console.warn('[exportChessModel] ✗ base 几何体生成失败，跳过该组件');
      }
    } else {
      console.log('[exportChessModel] 底座数据不存在，跳过');
    }

    // ========== 处理柱体组件 ==========
    console.log('\n[exportChessModel] ----- 处理柱体组件 -----');
    if (column && column.shape) {
      console.log('[exportChessModel] 柱体数据存在，开始生成几何体');
      const columnGeometry = createColumnGeometry(column, baseheight);
      if (columnGeometry) {
        const columnMaterial = createMaterial(column.material, '#CD853F');
        const columnMesh = new Mesh(columnGeometry, columnMaterial);
        if (columnMesh && columnMesh.geometry) {
          meshes.push(columnMesh);
          console.log('[exportChessModel] ✓ 成功添加 column 组件');
        }

        // 处理柱体浮雕图案
        if (column.pattern && column.pattern.shape !== 'none') {
          console.log('[exportChessModel] 检测到柱体浮雕图案');
          const patternGeometry = await createPatternGeometry(
            column.pattern,
            column.position,
            column.shape.height,
            baseheight,
            'column'
          );
          if (patternGeometry) {
            const patternMaterial = createMaterial(column.material, '#CD853F');
            const patternMesh = new Mesh(patternGeometry, patternMaterial);
            if (patternMesh && patternMesh.geometry) {
              meshes.push(patternMesh);
              console.log('[exportChessModel] ✓ 成功添加 column 浮雕图案');
            }
          }
        }
      } else {
        console.warn('[exportChessModel] ✗ column 几何体生成失败，跳过该组件');
      }
    } else {
      console.log('[exportChessModel] 柱体数据不存在，跳过');
    }

    // ========== 处理装饰物组件 ==========
    console.log('\n[exportChessModel] ----- 处理装饰物组件 -----');
    if (decoration && decoration.modelId) {
      console.log('[exportChessModel] 装饰物数据存在，开始生成几何体');
      const decorationGeometry = createDecorationGeometry(decoration);
      if (decorationGeometry) {
        const decorationMaterial = createMaterial(decoration.material, '#FFD700');
        const decorationMesh = new Mesh(decorationGeometry, decorationMaterial);
        if (decorationMesh && decorationMesh.geometry) {
          meshes.push(decorationMesh);
          console.log('[exportChessModel] ✓ 成功添加 decoration 组件');
        }
      } else {
        console.warn('[exportChessModel] ✗ decoration 几何体生成失败，跳过该组件');
      }
    } else {
      console.log('[exportChessModel] 装饰物数据不存在，跳过');
    }

    // ========== 检查是否有可导出的几何体 ==========
    console.log('\n[exportChessModel] ----- 几何体合并准备 -----');
    console.log('[exportChessModel] 网格数量:', meshes.length);

    if (meshes.length === 0) {
      throw new Error('没有可导出的几何体，请检查模型是否包含可见的组件');
    }

    // ========== 处理所有几何体，统一属性 ==========
    console.log('[exportChessModel] 开始处理几何体属性...');
    const allGeometries = meshes
      .map((mesh, index) => {
        console.log(`[exportChessModel] 处理几何体 ${index}...`);
        
        if (!mesh || !mesh.geometry) {
          console.warn(`[exportChessModel] 跳过无效网格 ${index}`);
          return null;
        }
        
        let geom = mesh.geometry.clone();
        
        if (!geom) {
          console.warn(`[exportChessModel] 跳过无效几何体 ${index}: clone 返回 null`);
          return null;
        }

        // 统一转换为非索引几何体，避免合并时的属性不一致问题
        if (geom.index !== null) {
          console.log(`[exportChessModel] 几何体 ${index} 转换为非索引几何体`);
          geom = geom.toNonIndexed();
        }

        if (!geom.attributes) {
          geom.attributes = {};
        }
        
        if (!geom.attributes.position) {
          console.warn(`[exportChessModel] 跳过无效几何体 ${index}: 缺少 position 属性`);
          return null;
        }

        const vertexCount = geom.attributes.position.count;
        console.log(`[exportChessModel] 几何体 ${index} 顶点数: ${vertexCount}`);
        
        if (vertexCount <= 0) {
          console.warn(`[exportChessModel] 跳过无效几何体 ${index}: 顶点数为 0`);
          return null;
        }

        // 添加默认 UV 属性
        if (!geom.attributes.uv) {
          console.log(`[exportChessModel] 为几何体 ${index} 添加默认 UV`);
          const defaultUVs = new Float32BufferAttribute(vertexCount * 2, 2);
          for (let i = 0; i < vertexCount; i++) {
            defaultUVs.setXY(i, 0, 0);
          }
          geom.setAttribute('uv', defaultUVs);
        }

        // 确保法线属性存在
        if (!geom.attributes.normal) {
          console.log(`[exportChessModel] 为几何体 ${index} 计算法线`);
          geom.computeVertexNormals();
        }

        // 初始化 morphAttributes
        geom.morphAttributes = {};

        console.log(`[exportChessModel] 几何体 ${index} 处理完成`);
        return geom;
      })
      .filter(geom => geom !== null);

    console.log('[exportChessModel] 有效几何体数量:', allGeometries.length);

    if (allGeometries.length === 0) {
      throw new Error('没有有效的几何体可以导出');
    }

    // ========== 合并所有几何体 ==========
    console.log('[exportChessModel] 开始合并几何体...');
    let mergedGeometry;
    try {
      mergedGeometry = mergeGeometries(allGeometries);
      console.log('[exportChessModel] ✓ 几何体合并成功');
      console.log('[exportChessModel] 合并后顶点数:', mergedGeometry.attributes.position.count);
    } catch (mergeError) {
      console.error('[exportChessModel] ✗ 几何体合并失败:', mergeError);
      throw new Error('几何体合并失败：' + mergeError.message);
    }

    // ========== 导出模型 ==========
    console.log('\n[exportChessModel] ----- 开始导出 -----');
    const unifiedMaterial = meshes[0].material;
    const mergedMesh = new Mesh(mergedGeometry, unifiedMaterial);

    let blob;
    if (format.toLowerCase() === 'stl') {
      console.log('[exportChessModel] 使用 STL 导出器');
      const exporter = new STLExporter();
      const result = exporter.parse(mergedMesh, { binary: true });
      blob = new Blob([result], { type: 'application/octet-stream' });
      console.log('[exportChessModel] STL 导出完成，文件大小:', blob.size, 'bytes');
    } else if (format.toLowerCase() === 'obj') {
      console.log('[exportChessModel] 使用 OBJ 导出器');
      const exporter = new OBJExporter();
      const group = new Group();
      meshes.forEach(mesh => {
        const meshCopy = mesh.clone();
        group.add(meshCopy);
      });
      const result = exporter.parse(group);
      blob = new Blob([result], { type: 'model/obj' });
      console.log('[exportChessModel] OBJ 导出完成，文件大小:', blob.size, 'bytes');
    } else {
      throw new Error(`不支持的导出格式：${format}`);
    }

    console.log('========================================');
    console.log('[exportChessModel] ✓ 导出成功！');
    console.log('[exportChessModel] 格式:', format);
    console.log('[exportChessModel] 网格数量:', meshes.length);
    console.log('[exportChessModel] 文件大小:', blob.size, 'bytes');
    console.log('========================================');

    return blob;
  } catch (error) {
    console.error('========================================');
    console.error('[exportChessModel] ✗ 导出失败:', error);
    console.error('========================================');
    throw error;
  }
}

/**
 * 生成导出文件名
 * 
 * @param {string} chessName - 棋子名称
 * @param {string} format - 文件格式
 * @returns {string} - 文件名
 */
export function generateExportFilename(chessName, format) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const safeName = chessName.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
  const filename = `${safeName}_${timestamp}.${format}`;
  console.log('[generateExportFilename] 生成文件名:', filename);
  return filename;
}
